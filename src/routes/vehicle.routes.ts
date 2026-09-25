import { Router } from "express";
import { VehicleController } from "../controllers/vehicle.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const vehicleController =
  new VehicleController();

// Criar um veículo.
router.post(
  "/",
  authMiddleware,
  (req, res) =>
    vehicleController.create(req, res),
);

// Atualizar um veículo específico.
router.put(
  "/:id",
  authMiddleware,
  (req, res) =>
    vehicleController.update(req, res),
);

// Eliminar um veículo específico.
router.delete(
  "/:id",
  authMiddleware,
  (req, res) =>
    vehicleController.delete(req, res),
);

// Obter um veículo específico.
router.get(
  "/:id",
  authMiddleware,
  (req, res) =>
    vehicleController.getById(req, res),
);

// Obter todos os veículos do utilizador.
router.get(
  "/",
  authMiddleware,
  (req, res) =>
    vehicleController.getMyVehicles(
      req,
      res,
    ),
);

export default router;