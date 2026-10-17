import fs from "fs/promises";

import { VehicleDocumentRepository } from "../repositories/vehicle-document.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";
import { DocumentType } from "../generated/prisma/enums";

export class VehicleDocumentService {
  private vehicleDocumentRepository: VehicleDocumentRepository;
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleDocumentRepository =
      new VehicleDocumentRepository();

    this.vehicleRepository =
      new VehicleRepository();
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

    return document;
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