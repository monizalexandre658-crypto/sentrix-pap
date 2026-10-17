-- CreateEnum
CREATE TYPE "VehicleEventType" AS ENUM ('GNSS_LOST', 'GNSS_RECOVERED', 'MOVEMENT_DETECTED', 'IGNITION_ON', 'IGNITION_OFF', 'GEOFENCE_EXIT', 'GEOFENCE_ENTRY', 'OWNER_AUTHORIZED', 'OWNER_NOT_AUTHORIZED', 'TAMPER_DETECTED', 'POWER_LOST', 'POWER_RECOVERED', 'COMMUNICATION_LOST', 'COMMUNICATION_RECOVERED', 'BACKUP_ACTIVE');

-- CreateEnum
CREATE TYPE "EventSource" AS ENUM ('DEVICE', 'SERVER', 'USER', 'SYSTEM');

-- CreateEnum
CREATE TYPE "TrustState" AS ENUM ('NORMAL', 'SUSPEITO', 'CRITICO', 'ROUBO_PROVAVEL');

-- CreateTable
CREATE TABLE "VehicleEvent" (
    "id" SERIAL NOT NULL,
    "vehicleId" INTEGER NOT NULL,
    "type" "VehicleEventType" NOT NULL,
    "source" "EventSource" NOT NULL,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "speed" DOUBLE PRECISION,
    "previousTrustState" "TrustState",
    "newTrustState" "TrustState",
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "VehicleEvent_vehicleId_occurredAt_idx" ON "VehicleEvent"("vehicleId", "occurredAt");

-- CreateIndex
CREATE INDEX "VehicleEvent_vehicleId_type_idx" ON "VehicleEvent"("vehicleId", "type");

-- AddForeignKey
ALTER TABLE "VehicleEvent" ADD CONSTRAINT "VehicleEvent_vehicleId_fkey" FOREIGN KEY ("vehicleId") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
