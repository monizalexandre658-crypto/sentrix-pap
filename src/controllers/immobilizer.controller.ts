
import { Request, Response } from "express";
import { VehicleService } from "../services/vehicle.service";
import {
  ImmobilizerSimulatorService,
} from "../services/immobilizer/immobilizer-simulator.service";

type ImmobilizerAction = (
  vehicleId: number,
) => ReturnType<ImmobilizerSimulatorService["getStatus"]>;

export class ImmobilizerController {
  private readonly vehicleService = new VehicleService();

  private readonly immobilizerService =
    new ImmobilizerSimulatorService();


  private async execute(
    req: Request,
    res: Response,
    action: ImmobilizerAction,
  ) {
    const userId = req.user?.userId;
    const vehicleId = Number(req.params.id);

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Utilizador não autenticado.",
      });
    }

    if (
      !Number.isInteger(vehicleId) ||
      vehicleId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "ID do veículo inválido.",
      });
    }


    try {
      await this.vehicleService.getVehicleById(
        vehicleId,
        userId,
      );
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "";

      if (message.toLowerCase().includes("encontrado")) {
        return res.status(404).json({
          success: false,
          message: "Veículo não encontrado.",
        });
      }

      console.error(
        "Erro ao verificar a propriedade do veículo:",
        error,
      );

      return res.status(500).json({
        success: false,
        message: "Não foi possível verificar o veículo.",
      });
    }


    try {
      const status = action(vehicleId);

      return res.status(200).json({
        success: true,
        message: status.message,
        immobilizer: status,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível executar o comando.";

      return res.status(409).json({
        success: false,
        message,
      });
    }
  }

  getStatus = (req: Request, res: Response) => {
    return this.execute(
      req,
      res,
      (vehicleId) =>
        this.immobilizerService.getStatus(vehicleId),
    );
  };

  requestLock = (req: Request, res: Response) => {
    return this.execute(
      req,
      res,
      (vehicleId) =>
        this.immobilizerService.requestLock(vehicleId),
    );
  };

  requestUnlock = (req: Request, res: Response) => {
    return this.execute(
      req,
      res,
      (vehicleId) =>
        this.immobilizerService.requestUnlock(vehicleId),
    );
  };

  confirmCommand = (req: Request, res: Response) => {
    return this.execute(
      req,
      res,
      (vehicleId) =>
        this.immobilizerService.confirmCommand(vehicleId),
    );
  };
}

export const immobilizerController =
  new ImmobilizerController();