import { Request, Response } from "express";
import { VehicleDocumentService } from "../services/vehicle-document.service";
import { DocumentType } from "../generated/prisma/enums";

export class VehicleDocumentController {
  private vehicleDocumentService: VehicleDocumentService;

  constructor() {
    this.vehicleDocumentService =
      new VehicleDocumentService();
  }



  async upload(
    req: Request,
    res: Response,
  ) {
    try {

      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Utilizador não autenticado.",
        });
      }


      const vehicleId = Number(
        req.params.id,
      );

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "ID do veículo inválido.",
        });
      }


      const file = req.file;

      if (!file) {
        return res.status(400).json({
          success: false,
          message:
            "Nenhum ficheiro foi enviado.",
        });
      }


      const type =
        req.body.type ||
        DocumentType.VEHICLE_REGISTRATION;

      if (
        type !==
        DocumentType.VEHICLE_REGISTRATION
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Tipo de documento inválido.",
        });
      }

      const document =
        await this.vehicleDocumentService.createDocument(
          vehicleId,
          userId,
          type,
          file.filename,
          file.originalname,
          file.mimetype,
          file.path,
        );

      return res.status(201).json({
        success: true,
        message:
          "Documento enviado com sucesso.",
        document,
      });
    } catch (error) {
      console.error(
        "Erro ao enviar documento:",
        error,
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro ao enviar documento.",
      });
    }
  }


  async getByVehicle(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Utilizador não autenticado.",
        });
      }

      const vehicleId = Number(
        req.params.id,
      );

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "ID do veículo inválido.",
        });
      }

      const documents =
        await this.vehicleDocumentService.getDocumentsByVehicleId(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        message:
          "Documentos do veículo obtidos com sucesso.",
        documents,
      });
    } catch (error) {
      console.error(
        "Erro ao obter documentos:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Documentos não encontrados.",
      });
    }
  }



  async getById(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Utilizador não autenticado.",
        });
      }

      const vehicleId = Number(
        req.params.id,
      );

      const documentId = Number(
        req.params.documentId,
      );

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "ID do veículo inválido.",
        });
      }

      if (!Number.isInteger(documentId) || documentId <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "ID do documento inválido.",
        });
      }

      const document =
        await this.vehicleDocumentService.getDocumentById(
          documentId,
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        message:
          "Documento obtido com sucesso.",
        document,
      });
    } catch (error) {
      console.error(
        "Erro ao obter documento:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Documento não encontrado.",
      });
    }
  }



  async verify(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Utilizador não autenticado.",
        });
      }

      const vehicleId = Number(req.params.id);
      const documentId = Number(req.params.documentId);

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      if (!Number.isInteger(documentId) || documentId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID do documento inválido.",
        });
      }

      const result =
        await this.vehicleDocumentService.verifyDocument(
          documentId,
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error) {
      console.error("Erro na verificação do documento:", error);

      const message =
        error instanceof Error
          ? error.message
          : "Erro ao verificar o documento.";

      const status =
        message.includes("não encontrado") ||
        message.includes("não pertence")
          ? 404
          : message.includes("não autenticado")
          ? 401
          : 422;

      return res.status(status).json({
        success: false,
        message,
      });
    }
  }

  async delete(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message:
            "Utilizador não autenticado.",
        });
      }

      const vehicleId = Number(
        req.params.id,
      );

      const documentId = Number(
        req.params.documentId,
      );

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "ID do veículo inválido.",
        });
      }

      if (!Number.isInteger(documentId) || documentId <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "ID do documento inválido.",
        });
      }

      const document =
        await this.vehicleDocumentService.deleteDocument(
          documentId,
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        message:
          "Documento eliminado com sucesso.",
        document,
      });
    } catch (error) {
      console.error(
        "Erro ao eliminar documento:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Documento não encontrado.",
      });
    }
  }
}