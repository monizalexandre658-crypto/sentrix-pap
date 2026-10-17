
import { Router } from "express";
import vehicleLocationController from "../controllers/vehicle-location.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post(
  "/:vehicleId/location",
  (req, res) => vehicleLocationController.createLocation(req, res),
);

router.get(
  "/:vehicleId/location",
  (req, res) => vehicleLocationController.getLatestLocation(req, res),
);

router.get(
  "/:vehicleId/location/history",
  (req, res) => vehicleLocationController.getLocationHistory(req, res),
);

export default router;