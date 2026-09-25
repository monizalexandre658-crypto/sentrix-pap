import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";

export class VehicleController {
  private vehicleService: VehicleService;

  constructor() {
    this.vehicleService = new VehicleService();
  }

  // Cria um novo veículo.
  async create(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Utilizador não autenticado.",
        });
      }

      const {
        brand,
        model,
        plate,
        color,
      } = req.body;

      const vehicle =
        await this.vehicleService.createVehicle(
          brand,
          model,
          plate,
          color,
          userId,
        );

      return res.status(201).json({
        success: true,
        message: "Veículo criado com sucesso.",
        vehicle,
      });
    } catch (error) {
      console.error(
        "Erro ao criar veículo:",
        error,
      );

      return res.status(400).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro ao criar veículo.",
      });
    }
  }

  // Obtém todos os veículos do utilizador autenticado.
  async getMyVehicles(
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

      const vehicles =
        await this.vehicleService.getVehiclesByUserId(
          userId,
        );

      return res.status(200).json({
        success: true,
        message:
          "Veículos do utilizador obtidos com sucesso.",
        vehicles,
      });
    } catch (error) {
      console.error(
        "Erro ao obter veículos:",
        error,
      );

      return res.status(500).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Erro ao obter veículos.",
      });
    }
  }

  // Obtém um veículo específico.
  async getById(
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

      if (!Number.isInteger(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      const vehicle =
        await this.vehicleService.getVehicleById(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        message: "Veículo obtido com sucesso.",
        vehicle,
      });
    } catch (error) {
      console.error(
        "Erro ao obter veículo:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Veículo não encontrado.",
      });
    }
  }

  // Atualiza um veículo.
  async update(
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
        await this.vehicleService.updateVehicle(
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
        message: "Veículo atualizado com sucesso.",
        vehicle,
      });
    } catch (error) {
      console.error(
        "Erro ao atualizar veículo:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Veículo não encontrado.",
      });
    }
  }

  // Elimina um veículo.
  async delete(
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

      if (!Number.isInteger(vehicleId)) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      const vehicle =
        await this.vehicleService.deleteVehicle(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        message: "Veículo eliminado com sucesso.",
        vehicle,
      });
    } catch (error) {
      console.error(
        "Erro ao eliminar veículo:",
        error,
      );

      return res.status(404).json({
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Veículo não encontrado.",
      });
    }
  }
}