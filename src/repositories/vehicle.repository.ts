import { prisma } from "../lib/prisma";

export class VehicleRepository {
  async create(
    brand: string,
    model: string,
    plate: string,
    color: string | undefined,
    userId: number,
    country?: string,
  ) {
    return prisma.vehicle.create({
      data: {
        brand,
        model,
        plate,
        color,
        userId,
        country,
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
      country?: string | null;
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

  
  async captureAndSetUnderReview(
    vehicleId: number,
    userId: number,
  ) {
    return prisma.$transaction(async (tx) => {
      const vehicle = await tx.vehicle.findFirst({
        where: { id: vehicleId, userId },
        select: { verificationStatus: true },
      });

      if (!vehicle) {
        throw new Error(
          "Veículo não encontrado ou não pertence ao utilizador.",
        );
      }

      await tx.vehicle.updateMany({
        where: { id: vehicleId, userId },
        data: { verificationStatus: "UNDER_REVIEW" },
      });

      return vehicle.verificationStatus;
    });
  }

  async updateVerificationIfStatus(
    vehicleId: number,
    userId: number,
    expectedStatus:
      | "PENDING"
      | "DOCUMENT_SUBMITTED"
      | "UNDER_REVIEW"
      | "VERIFIED"
      | "REJECTED",
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
        verificationStatus: expectedStatus,
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