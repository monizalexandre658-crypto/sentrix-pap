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
      select: {
        id: true,
        type: true,
        fileName: true,
        originalName: true,
        mimeType: true,
        uploadedAt: true,
        vehicleId: true,
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
      select: {
        id: true,
        type: true,
        fileName: true,
        originalName: true,
        mimeType: true,
        uploadedAt: true,
        vehicleId: true,
      },
    });
  }

  async findByIdAndVehicleIdWithPath(
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