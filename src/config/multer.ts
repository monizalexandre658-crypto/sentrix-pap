import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const uploadDirectory = path.resolve(
  process.cwd(),
  "uploads",
  "vehicles",
);

if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, {
    recursive: true,
  });
}

const storage = multer.diskStorage({
  destination: (
    req,
    file,
    callback,
  ) => {
    callback(null, uploadDirectory);
  },

  filename: (
    req,
    file,
    callback,
  ) => {
    const uniqueName =
      `vehicle-${Date.now()}-${Math.round(
        Math.random() * 1_000_000,
      )}.pdf`;

    callback(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback,
) => {
  if (file.mimetype === "application/pdf") {
    callback(null, true);
    return;
  }

  callback(
    new Error(
      "Formato de ficheiro não permitido. Envie o documento em formato PDF.",
    ),
  );
};

export const vehicleDocumentUpload =
  multer({
    storage,
    fileFilter,
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

// PDF magic bytes: %PDF-
// The PDF spec allows the header to appear within the first 1024 bytes.
const PDF_SIGNATURE = Buffer.from("%PDF-");
const PDF_SEARCH_WINDOW = 1024;

function unlinkSafe(filePath: string): void {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(
        "Falha ao remover ficheiro rejeitado:",
        err.code,
        err.message,
      );
    }
  });
}

/**
 * Post-multer middleware: validates the uploaded file's actual content.
 * Must run after vehicleDocumentUpload.single() and before the controller.
 * Deletes the file from disk if validation fails to prevent orphan files.
 */
export function validateUploadedPdf(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const file = req.file;

  if (!file) {
    next();
    return;
  }

  if (file.size === 0) {
    unlinkSafe(file.path);
    res.status(400).json({
      success: false,
      message: "O ficheiro enviado está vazio.",
    });
    return;
  }

  let fd: number | null = null;

  try {
    const windowSize = Math.min(PDF_SEARCH_WINDOW, file.size);
    const buffer = Buffer.alloc(windowSize);
    fd = fs.openSync(file.path, "r");
    const bytesRead = fs.readSync(fd, buffer, 0, windowSize, 0);
    fs.closeSync(fd);
    fd = null;

    if (
      bytesRead < PDF_SIGNATURE.length ||
      buffer.subarray(0, bytesRead).indexOf(PDF_SIGNATURE) === -1
    ) {
      unlinkSafe(file.path);
      res.status(400).json({
        success: false,
        message:
          "O ficheiro enviado não é um PDF válido.",
      });
      return;
    }
  } catch {
    if (fd !== null) {
      try {
        fs.closeSync(fd);
      } catch {}
    }
    unlinkSafe(file.path);
    res.status(400).json({
      success: false,
      message:
        "Não foi possível verificar o conteúdo do ficheiro.",
    });
    return;
  }

  next();
}
