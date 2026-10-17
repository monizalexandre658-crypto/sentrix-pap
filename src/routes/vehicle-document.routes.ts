import { Router } from "express";
import { VehicleDocumentController } from "../controllers/vehicle-document.controller";
import { vehicleDocumentUpload } from "../config/multer";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const vehicleDocumentController =
  new VehicleDocumentController();


 
router.post(
  "/vehicles/:id/documents",
  authMiddleware,
  vehicleDocumentUpload.single("file"),
  vehicleDocumentController.upload.bind(
    vehicleDocumentController,
  ),
);


router.get(
  "/vehicles/:id/documents",
  authMiddleware,
  vehicleDocumentController.getByVehicle.bind(
    vehicleDocumentController,
  ),
);


router.get(
  "/vehicles/:id/documents/:documentId",
  authMiddleware,
  vehicleDocumentController.getById.bind(
    vehicleDocumentController,
  ),
);


router.delete(
  "/vehicles/:id/documents/:documentId",
  authMiddleware,
  vehicleDocumentController.delete.bind(
    vehicleDocumentController,
  ),
);

export default router;