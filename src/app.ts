
import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import vehicleRoutes from "./routes/vehicle.routes";
import vehicleDocumentRoutes from "./routes/vehicle-document.routes";
import vehicleLocationRoutes from "./routes/vehicle-location.routes";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
  }),
);

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "SentriX API está online",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api", vehicleDocumentRoutes);
app.use("/api/vehicles", vehicleLocationRoutes);

export default app;