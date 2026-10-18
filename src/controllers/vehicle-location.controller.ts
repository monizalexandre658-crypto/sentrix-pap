import { Request, Response } from "express";
import vehicleLocationService from "../services/vehicle-location.service";

export class VehicleLocationController {
  async createLocation(
    req: Request,
    res: Response,
  ) {
    try {
      const vehicleId = Number(req.params.vehicleId);

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Utilizador não autenticado.",
        });
      }

      const userId = req.user.userId;

      const {
        latitude,
        longitude,
        accuracy,
        speed,
        heading,
      } = req.body;

      const location =
        await vehicleLocationService.createLocation({
          vehicleId,
          userId,
          latitude: Number(latitude),
          longitude: Number(longitude),
          accuracy:
            accuracy !== undefined
              ? Number(accuracy)
              : undefined,
          speed:
            speed !== undefined
              ? Number(speed)
              : undefined,
          heading:
            heading !== undefined
              ? Number(heading)
              : undefined,
        });

      return res.status(201).json({
        success: true,
        message: "Localização registada com sucesso.",
        location,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível registar a localização.";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async getLatestLocation(
    req: Request,
    res: Response,
  ) {
    try {
      const vehicleId = Number(req.params.vehicleId);

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Utilizador não autenticado.",
        });
      }

      const userId = req.user.userId;

      const location =
        await vehicleLocationService.getLatestLocation(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        location,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível obter a localização.";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  async getLocationHistory(
    req: Request,
    res: Response,
  ) {
    try {
      const vehicleId = Number(req.params.vehicleId);

      if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
        return res.status(400).json({
          success: false,
          message: "ID do veículo inválido.",
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "Utilizador não autenticado.",
        });
      }

      const userId = req.user.userId;

      const locations =
        await vehicleLocationService.getLocationHistory(
          vehicleId,
          userId,
        );

      return res.status(200).json({
        success: true,
        locations,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível obter o histórico de localização.";

      return res.status(400).json({
        success: false,
        message,
      });
    }
  }
}

export default new VehicleLocationController();