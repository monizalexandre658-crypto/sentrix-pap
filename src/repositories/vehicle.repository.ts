import { prisma } from "../lib/prisma";

export class VehicleRepository {
  // Cria um novo veículo associado ao utilizador autenticado.
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

  // Obtém todos os veículos pertencentes ao utilizador.
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

  // Obtém um veículo específico apenas se pertencer ao utilizador.
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

  // Atualiza um veículo apenas se pertencer ao utilizador.
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

  // Elimina um veículo apenas se pertencer ao utilizador.
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