import { prisma } from "../lib/prisma";
import { DocumentType } from "../generated/prisma/enums";

export class VehicleDocumentRepository {
  async create(
    type: DocumentType,
    fileName: string,
    originalName: string,
    mimeType: string,
    filePath: string,
    vehicleId: number,
  ) {
    return prisma.vehicleDocument.create({
      data: {
        type,
        fileName,
        originalName,
        mimeType,
        filePath,
        vehicleId,
      },
    });
  }

  async findByVehicleId(vehicleId: number) {
    return prisma.vehicleDocument.findMany({
      where: {
        vehicleId,
      },
      orderBy: {
        uploadedAt: "desc",
      },
    });
  }

  async findByIdAndVehicleId(
    documentId: number,
    vehicleId: number,
  ) {
    return prisma.vehicleDocument.findFirst({
      where: {
        id: documentId,
        vehicleId,
      },
    });
  }

  async deleteByIdAndVehicleId(
    documentId: number,
    vehicleId: number,
  ) {
    return prisma.vehicleDocument.deleteMany({
      where: {
        id: documentId,
        vehicleId,
      },
    });
  }
}