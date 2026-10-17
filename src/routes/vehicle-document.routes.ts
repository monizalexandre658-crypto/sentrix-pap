import { Router, Request, Response, NextFunction } from "express";
import multer from "multer";
import { VehicleDocumentController } from "../controllers/vehicle-document.controller";
import {
  vehicleDocumentUpload,
  validateUploadedPdf,
} from "../config/multer";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

const vehicleDocumentController =
  new VehicleDocumentController();

function multerUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  vehicleDocumentUpload.single("file")(req, res, (err) => {
    if (err) {
      if (
        err instanceof multer.MulterError &&
        err.code === "LIMIT_FILE_SIZE"
      ) {
        return res.status(400).json({
          success: false,
          message:
            "O ficheiro excede o tamanho máximo permitido de 10 MB.",
        });
      }

      return res.status(400).json({
        success: false,
        message:
          err instanceof Error
            ? err.message
            : "Erro ao processar o ficheiro.",
      });
    }
    next();
  });
}

router.post(
  "/vehicles/:id/documents",
  authMiddleware,
  multerUpload,
  validateUploadedPdf,
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


router.post(
  "/vehicles/:id/documents/:documentId/verify",
  authMiddleware,
  vehicleDocumentController.verify.bind(
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
