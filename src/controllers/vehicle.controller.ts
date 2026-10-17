import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";

const vehicleService = new VehicleService();

export class VehicleController {
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Não autenticado.",
        });
      }

      const {
        brand,
        model,
        plate,
        color,
      } = req.body;

      if (!brand || !model || !plate) {
        return res.status(400).json({
          success: false,
          message:
            "Marca, modelo e matrícula são obrigatórios.",
        });
      }

      const vehicle =
        await vehicleService.createVehicle(
          brand,
          model,
          plate,
          color,
          userId,
        );

      return res.status(201).json({
        success: true,
        vehicle,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Erro ao criar veículo.",
      });
    }
  }

  async getMyVehicles(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Não autenticado.",
        });
      }

      const vehicles =
        await vehicleService.getVehiclesByUserId(
          userId,
        );

      return res.status(200).json({
        success: true,
        vehicles,
      });
    } catch (error: any) {
      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Erro ao obter veículos.",
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
          message: "Não autenticado.",
        });
      }

      const vehicleId = Number(req.params.id);

      if (!Number.isInteger(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      const vehicle =
        await vehicleService.getVehicleById(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        vehicle,
      });
    } catch (error: any) {
      console.error(error);

      if (
        error.message ===
        "Veículo não encontrado."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Erro ao obter veículo.",
      });
    }
  }

  async getVerification(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Não autenticado.",
        });
      }

      const vehicleId = Number(req.params.id);

      if (!Number.isInteger(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      const vehicle =
        await vehicleService.getVerificationById(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        vehicle,
      });
    } catch (error: any) {
      console.error(error);

      if (
        error.message ===
        "Veículo não encontrado."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Erro ao obter estado da verificação.",
      });
    }
  }

  async update(
    req: Request,
    res: Response,
  ) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Não autenticado.",
        });
      }

      const vehicleId = Number(req.params.id);

      if (!Number.isInteger(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      const {
        brand,
        model,
        plate,
        color,
      } = req.body;

      const vehicle =
        await vehicleService.updateVehicle(
          vehicleId,
          userId,
          {
            brand,
            model,
            plate,
            color,
          },
        );

      return res.status(200).json({
        success: true,
        vehicle,
      });
    } catch (error: any) {
      console.error(error);

      if (
        error.message ===
        "Veículo não encontrado."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Erro ao atualizar veículo.",
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
          message: "Não autenticado.",
        });
      }

      const vehicleId = Number(req.params.id);

      if (!Number.isInteger(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      await vehicleService.deleteVehicle(
        vehicleId,
        userId,
      );

      return res.status(200).json({
        success: true,
        message: "Veículo eliminado com sucesso.",
      });
    } catch (error: any) {
      console.error(error);

      if (
        error.message ===
        "Veículo não encontrado."
      ) {
        return res.status(404).json({
          success: false,
          message: error.message,
        });
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Erro ao eliminar veículo.",
      });
    }
  }
}

export const vehicleController =
  new VehicleController();