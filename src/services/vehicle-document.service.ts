import fs from "fs/promises";

import { VehicleDocumentRepository } from "../repositories/vehicle-document.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { DocumentType } from "../generated/prisma/enums";
import { VehicleDocumentOCRService } from "./ocr/vehicle-document-ocr.service";
import { VehicleDocumentExtractorService } from "./verification/vehicle-document-extractor.service";
import { VehicleDocumentVerificationService } from "./verification/vehicle-document-verification.service";

export class VehicleDocumentService {
  private vehicleDocumentRepository: VehicleDocumentRepository;
  private vehicleRepository: VehicleRepository;
  private ocrService: VehicleDocumentOCRService;
  private extractorService: VehicleDocumentExtractorService;
  private verificationService: VehicleDocumentVerificationService;

  constructor() {
    this.vehicleDocumentRepository =
      new VehicleDocumentRepository();

    this.vehicleRepository =
      new VehicleRepository();

    this.ocrService =
      new VehicleDocumentOCRService();

    this.extractorService =
      new VehicleDocumentExtractorService();

    this.verificationService =
      new VehicleDocumentVerificationService();
  }

  async createDocument(
    vehicleId: number,
    userId: number,
    type: DocumentType,
    fileName: string,
    originalName: string,
    mimeType: string,
    filePath: string,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error(
        "Veículo não encontrado ou não pertence ao utilizador.",
      );
    }

    if (!fileName) {
      throw new Error(
        "Nome do ficheiro não fornecido.",
      );
    }

    if (!originalName) {
      throw new Error(
        "Nome original do ficheiro não fornecido.",
      );
    }

    if (!mimeType) {
      throw new Error(
        "Tipo do ficheiro não fornecido.",
      );
    }

    if (!filePath) {
      throw new Error(
        "Localização do ficheiro não fornecida.",
      );
    }

    if (
      type !==
      DocumentType.VEHICLE_REGISTRATION
    ) {
      throw new Error(
        "Tipo de documento inválido.",
      );
    }

    const document =
      await this.vehicleDocumentRepository.create(
        type,
        fileName,
        originalName,
        mimeType,
        filePath,
        vehicleId,
      );

    // Only advance to DOCUMENT_SUBMITTED from PENDING or REJECTED
    if (
      vehicle.verificationStatus === "PENDING" ||
      vehicle.verificationStatus === "REJECTED"
    ) {
      await this.vehicleRepository.updateVerification(
        vehicleId,
        userId,
        { verificationStatus: "DOCUMENT_SUBMITTED" },
      );
    }

    return document;
  }

  async verifyDocument(
    documentId: number,
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error(
        "Veículo não encontrado ou não pertence ao utilizador.",
      );
    }

    const document =
      await this.vehicleDocumentRepository.findByIdAndVehicleId(
        documentId,
        vehicleId,
      );

    if (!document) {
      throw new Error(
        "Documento não encontrado.",
      );
    }

    // Only PDF is supported by the OCR engine
    if (document.mimeType !== "application/pdf") {
      throw new Error(
        "Apenas documentos PDF são suportados para verificação por OCR. Envie o documento em formato PDF.",
      );
    }

    // Atomically capture current status and set UNDER_REVIEW (P4: $transaction)
    const previousStatus =
      await this.vehicleRepository.captureAndSetUnderReview(
        vehicleId,
        userId,
      );

    try {
      // OCR — technical failures must not produce a definitive REJECTED
      let rawText: string;
      try {
        rawText = await this.ocrService.extractTextFromPdf(document.filePath);
      } catch (error) {
        // Restore previous status only if still UNDER_REVIEW (prevents overwriting a parallel completion)
        await this.vehicleRepository.updateVerificationIfStatus(
          vehicleId,
          userId,
          "UNDER_REVIEW",
          { verificationStatus: previousStatus },
        );
        throw new Error(
          "Falha técnica ao processar o documento. O estado da verificação foi reposto. Tente novamente.",
        );
      }

      if (!rawText || rawText.trim().length < 20) {
        await this.vehicleRepository.updateVerification(
          vehicleId,
          userId,
          {
            verificationStatus: "REJECTED",
            verificationDate: new Date(),
            verificationNotes:
              "O documento não contém texto legível suficiente para verificação.",
          },
        );
        return {
          verified: false,
          reason: "unreadable",
          message:
            "O documento não contém texto legível suficiente para verificação.",
        };
      }

      // Extract fields from OCR text
      const extracted = this.extractorService.extract(rawText);

      const hasMinimumData =
        extracted.plate !== null ||
        extracted.brand !== null ||
        extracted.model !== null;

      if (!hasMinimumData) {
        await this.vehicleRepository.updateVerification(
          vehicleId,
          userId,
          {
            verificationStatus: "REJECTED",
            verificationDate: new Date(),
            verificationNotes:
              "O documento não contém dados suficientes para identificar o veículo (matrícula, marca ou modelo em falta).",
          },
        );
        return {
          verified: false,
          reason: "insufficient_data",
          message:
            "O documento não contém dados suficientes para identificar o veículo.",
        };
      }

      // Cross-check extracted data against the registered vehicle
      const result = await this.verificationService.verify(
        vehicleId,
        userId,
        extracted,
      );

      return {
        verified: result.verified,
        reason: result.verified ? "verified" : "mismatch",
        matches: result.matches,
        document: {
          plate: result.document.plate,
          brand: result.document.brand,
          model: result.document.model,
          color: result.document.color,
          country: result.document.country,
        },
        vehicle: result.vehicle,
      };
    } catch (error) {
      // Restore state if still UNDER_REVIEW — idempotent (no-op if a final state was already written)
      await this.vehicleRepository.updateVerificationIfStatus(
        vehicleId,
        userId,
        "UNDER_REVIEW",
        { verificationStatus: previousStatus },
      ).catch((restoreError) => {
        console.error(
          "Erro ao restaurar estado do veículo após falha técnica:",
          restoreError instanceof Error
            ? restoreError.message
            : String(restoreError),
        );
      });

      if (
        error instanceof Error &&
        error.message.startsWith("Falha técnica")
      ) {
        throw error;
      }

      console.error(
        "Erro técnico inesperado na verificação documental:",
        error instanceof Error ? error.message : String(error),
      );
      throw new Error(
        "Falha técnica inesperada durante a verificação. O estado da verificação foi reposto. Tente novamente.",
      );
    }
  }

  async getDocumentsByVehicleId(
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error(
        "Veículo não encontrado ou não pertence ao utilizador.",
      );
    }

    return this.vehicleDocumentRepository.findByVehicleId(
      vehicleId,
    );
  }

  async getDocumentById(
    documentId: number,
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error(
        "Veículo não encontrado ou não pertence ao utilizador.",
      );
    }

    const document =
      await this.vehicleDocumentRepository.findByIdAndVehicleId(
        documentId,
        vehicleId,
      );

    if (!document) {
      throw new Error(
        "Documento não encontrado.",
      );
    }

    return document;
  }

  async deleteDocument(
    documentId: number,
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error(
        "Veículo não encontrado ou não pertence ao utilizador.",
      );
    }

    const document =
      await this.vehicleDocumentRepository.findByIdAndVehicleId(
        documentId,
        vehicleId,
      );

    if (!document) {
      throw new Error(
        "Documento não encontrado.",
      );
    }

    
    try {
  console.log("Ficheiro que será eliminado:");
  console.log(document.filePath);

  await fs.unlink(document.filePath);

  console.log("Ficheiro eliminado com sucesso.");
} catch (error: any) {
  console.error("Erro ao eliminar ficheiro:");
  console.error(error);

  if (error.code !== "ENOENT") {
    throw new Error(
      "Não foi possível eliminar o ficheiro do documento.",
    );
  }
}

    
    await this.vehicleDocumentRepository.deleteByIdAndVehicleId(
      documentId,
      vehicleId,
    );

    return document;
  }
}