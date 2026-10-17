
import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { vehicleController } from "../controllers/vehicle.controller";
import {
  immobilizerController,
} from "../controllers/immobilizer.controller";

const router = Router();


router.post(
  "/",
  authMiddleware,
  vehicleController.create,
);


router.get(
  "/",
  authMiddleware,
  vehicleController.getMyVehicles,
);


router.get(
  "/:id/verification",
  authMiddleware,
  vehicleController.getVerification,
);


router.get(
  "/:id/immobilizer",
  authMiddleware,
  immobilizerController.getStatus,
);


router.post(
  "/:id/immobilizer/lock",
  authMiddleware,
  immobilizerController.requestLock,
);


router.post(
  "/:id/immobilizer/unlock",
  authMiddleware,
  immobilizerController.requestUnlock,
);


router.post(
  "/:id/immobilizer/confirm",
  authMiddleware,
  immobilizerController.confirmCommand,
);


router.get(
  "/:id",
  authMiddleware,
  vehicleController.getById,
);


router.put(
  "/:id",
  authMiddleware,
  vehicleController.update,
);


router.delete(
  "/:id",
  authMiddleware,
  vehicleController.delete,
);

export default router;