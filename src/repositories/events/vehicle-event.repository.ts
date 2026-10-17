import { prisma } from "../../lib/prisma";

export interface CreateVehicleEventData {
  vehicleId: number;

  type:
    | "GNSS_LOST"
    | "GNSS_RECOVERED"
    | "MOVEMENT_DETECTED"
    | "IGNITION_ON"
    | "IGNITION_OFF"
    | "GEOFENCE_EXIT"
    | "GEOFENCE_ENTRY"
    | "OWNER_AUTHORIZED"
    | "OWNER_NOT_AUTHORIZED"
    | "TAMPER_DETECTED"
    | "POWER_LOST"
    | "POWER_RECOVERED"
    | "COMMUNICATION_LOST"
    | "COMMUNICATION_RECOVERED"
    | "BACKUP_ACTIVE";

  source:
    | "DEVICE"
    | "SERVER"
    | "USER"
    | "SYSTEM";

  occurredAt?: Date;

  latitude?: number;
  longitude?: number;
  speed?: number;

  previousTrustState?:
    | "NORMAL"
    | "SUSPEITO"
    | "CRITICO"
    | "ROUBO_PROVAVEL";

  newTrustState?:
    | "NORMAL"
    | "SUSPEITO"
    | "CRITICO"
    | "ROUBO_PROVAVEL";

  metadata?: object;
}

export class VehicleEventRepository {
  async create(data: CreateVehicleEventData) {
    return prisma.vehicleEvent.create({
      data: {
        vehicleId: data.vehicleId,
        type: data.type,
        source: data.source,
        occurredAt: data.occurredAt,
        latitude: data.latitude,
        longitude: data.longitude,
        speed: data.speed,
        previousTrustState: data.previousTrustState,
        newTrustState: data.newTrustState,
        metadata: data.metadata,
      },
    });
  }

  async findById(id: number) {
    return prisma.vehicleEvent.findUnique({
      where: {
        id,
      },
    });
  }

  async findByVehicleId(vehicleId: number) {
    return prisma.vehicleEvent.findMany({
      where: {
        vehicleId,
      },
      orderBy: {
        occurredAt: "desc",
      },
    });
  }

  async findRecentByVehicleId(
    vehicleId: number,
    limit: number = 20,
  ) {
    return prisma.vehicleEvent.findMany({
      where: {
        vehicleId,
      },
      orderBy: {
        occurredAt: "desc",
      },
      take: limit,
    });
  }
}