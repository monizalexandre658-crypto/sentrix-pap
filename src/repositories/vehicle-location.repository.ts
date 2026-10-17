import { prisma } from "../lib/prisma";

interface CreateVehicleLocationData {
  vehicleId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export class VehicleLocationRepository {
  async create(data: CreateVehicleLocationData) {
    return prisma.vehicleLocation.create({
      data: {
        vehicleId: data.vehicleId,
        latitude: data.latitude,
        longitude: data.longitude,
        accuracy: data.accuracy,
        speed: data.speed,
        heading: data.heading,
      },
    });
  }

  async findLatestByVehicleId(vehicleId: number) {
    return prisma.vehicleLocation.findFirst({
      where: {
        vehicleId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  async findHistoryByVehicleId(
    vehicleId: number,
    limit = 100,
  ) {
    return prisma.vehicleLocation.findMany({
      where: {
        vehicleId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  }
}

export default new VehicleLocationRepository();