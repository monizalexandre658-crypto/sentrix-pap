import { prisma } from "../lib/prisma";

export class VehicleRepository {
  async create(
    brand: string,
    model: string,
    plate: string,
    color: string | undefined,
    userId: number,
  ) {
    return prisma.vehicle.create({
      data: {
        brand,
        model,
        plate,
        color,
        userId,
      },
    });
  }

  async findByUserId(userId: number) {
    return prisma.vehicle.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findByIdAndUserId(
    vehicleId: number,
    userId: number,
  ) {
    return prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId,
      },
    });
  }

  async updateByIdAndUserId(
    vehicleId: number,
    userId: number,
    data: {
      brand?: string;
      model?: string;
      plate?: string;
      color?: string;
    },
  ) {
    return prisma.vehicle.updateMany({
      where: {
        id: vehicleId,
        userId,
      },
      data,
    });
  }

  
  async updateVerification(
    vehicleId: number,
    userId: number,
    data: {
      verificationStatus:
        | "PENDING"
        | "DOCUMENT_SUBMITTED"
        | "UNDER_REVIEW"
        | "VERIFIED"
        | "REJECTED";
      verificationDate?: Date;
      verificationNotes?: string;
    },
  ) {
    return prisma.vehicle.updateMany({
      where: {
        id: vehicleId,
        userId,
      },
      data,
    });
  }

  
  async findVerificationByIdAndUserId(
    vehicleId: number,
    userId: number,
  ) {
    return prisma.vehicle.findFirst({
      where: {
        id: vehicleId,
        userId,
      },
      select: {
        id: true,
        brand: true,
        model: true,
        plate: true,
        verificationStatus: true,
        verificationDate: true,
        verificationNotes: true,
      },
    });
  }

  async deleteByIdAndUserId(
    vehicleId: number,
    userId: number,
  ) {
    return prisma.vehicle.deleteMany({
      where: {
        id: vehicleId,
        userId,
      },
    });
  }
}