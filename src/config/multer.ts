import multer from "multer";
import path from "path";
import fs from "fs";

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
    const extension =
      path.extname(file.originalname);

    const uniqueName =
      `vehicle-${Date.now()}-${Math.round(
        Math.random() * 1_000_000,
      )}${extension}`;

    callback(null, uniqueName);
  },
});

const fileFilter: multer.Options["fileFilter"] = (
  req,
  file,
  callback,
) => {
  const allowedMimeTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  if (
    allowedMimeTypes.includes(
      file.mimetype,
    )
  ) {
    callback(null, true);
    return;
  }

  callback(
    new Error(
      "Formato de ficheiro não permitido. Envie PDF, JPG ou PNG.",
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