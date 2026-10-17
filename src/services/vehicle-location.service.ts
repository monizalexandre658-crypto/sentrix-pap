
import vehicleLocationRepository from "../repositories/vehicle-location.repository";
import { VehicleRepository } from "../repositories/vehicle.repository";

interface CreateVehicleLocationData {
  vehicleId: number;
  userId: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  heading?: number;
}

export class VehicleLocationService {
  private readonly vehicleRepository = new VehicleRepository();

  async createLocation(data: CreateVehicleLocationData) {
    this.validateCoordinates(data.latitude, data.longitude);

    this.validateOptionalValues(data);

    const vehicle = await this.vehicleRepository.findByIdAndUserId(
      data.vehicleId,
      data.userId,
    );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return vehicleLocationRepository.create({
      vehicleId: data.vehicleId,
      latitude: data.latitude,
      longitude: data.longitude,
      accuracy: data.accuracy,
      speed: data.speed,
      heading: data.heading,
    });
  }

  async getLatestLocation(vehicleId: number, userId: number) {
    const vehicle = await this.vehicleRepository.findByIdAndUserId(
      vehicleId,
      userId,
    );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return vehicleLocationRepository.findLatestByVehicleId(vehicleId);
  }

  async getLocationHistory(vehicleId: number, userId: number) {
    const vehicle = await this.vehicleRepository.findByIdAndUserId(
      vehicleId,
      userId,
    );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return vehicleLocationRepository.findHistoryByVehicleId(vehicleId);
  }

  private validateCoordinates(latitude: number, longitude: number) {
    if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90) {
      throw new Error("A latitude deve ser um número entre -90 e 90.");
    }

    if (
      !Number.isFinite(longitude) ||
      longitude < -180 ||
      longitude > 180
    ) {
      throw new Error("A longitude deve ser um número entre -180 e 180.");
    }
  }

  private validateOptionalValues(data: CreateVehicleLocationData) {
    if (
      data.accuracy !== undefined &&
      (!Number.isFinite(data.accuracy) || data.accuracy < 0)
    ) {
      throw new Error("A precisão é inválida.");
    }

    if (
      data.speed !== undefined &&
      (!Number.isFinite(data.speed) || data.speed < 0)
    ) {
      throw new Error("A velocidade é inválida.");
    }

    if (
      data.heading !== undefined &&
      (!Number.isFinite(data.heading) ||
        data.heading < 0 ||
        data.heading > 360)
    ) {
      throw new Error("A direção deve estar entre 0 e 360 graus.");
    }
  }
}

export default new VehicleLocationService();