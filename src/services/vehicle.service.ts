import { VehicleRepository } from "../repositories/vehicle.repository";

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  async createVehicle(
    brand: string,
    model: string,
    plate: string,
    color: string | undefined,
    userId: number,
    country?: string,
  ) {
    return this.vehicleRepository.create(
      brand,
      model,
      plate,
      color,
      userId,
      country,
    );
  }

  async getVehiclesByUserId(userId: number) {
    return this.vehicleRepository.findByUserId(userId);
  }

  async getVehicleById(
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return vehicle;
  }

  
  async getVerificationById(
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findVerificationByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    return vehicle;
  }

  async updateVehicle(
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
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    await this.vehicleRepository.updateByIdAndUserId(
      vehicleId,
      userId,
      data,
    );

    return this.vehicleRepository.findByIdAndUserId(
      vehicleId,
      userId,
    );
  }

  async deleteVehicle(
    vehicleId: number,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error("Veículo não encontrado.");
    }

    await this.vehicleRepository.deleteByIdAndUserId(
      vehicleId,
      userId,
    );
  }
}