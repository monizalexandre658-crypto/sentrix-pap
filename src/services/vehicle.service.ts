import { VehicleRepository } from "../repositories/vehicle.repository";

export class VehicleService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository = new VehicleRepository();
  }

  // Cria um veículo para o utilizador autenticado.
  async createVehicle(
    brand: string,
    model: string,
    plate: string,
    color: string | undefined,
    userId: number,
  ) {
    const vehicle =
      await this.vehicleRepository.create(
        brand,
        model,
        plate,
        color,
        userId,
      );

    return vehicle;
  }

  // Obtém todos os veículos pertencentes ao utilizador.
  async getVehiclesByUserId(userId: number) {
    const vehicles =
      await this.vehicleRepository.findByUserId(
        userId,
      );

    return vehicles;
  }

  // Obtém um veículo específico pertencente ao utilizador.
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

  // Atualiza um veículo pertencente ao utilizador.
  async updateVehicle(
    vehicleId: number,
    userId: number,
    data: {
      brand?: string;
      model?: string;
      plate?: string;
      color?: string;
    },
  ) {
    // Confirma primeiro que o veículo pertence ao utilizador.
    const existingVehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!existingVehicle) {
      throw new Error("Veículo não encontrado.");
    }

    // Atualiza o veículo.
    await this.vehicleRepository.updateByIdAndUserId(
      vehicleId,
      userId,
      data,
    );

    // Obtém novamente o veículo já atualizado.
    const updatedVehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!updatedVehicle) {
      throw new Error(
        "Não foi possível obter o veículo atualizado.",
      );
    }

    return updatedVehicle;
  }

  // Elimina um veículo pertencente ao utilizador.
  async deleteVehicle(
    vehicleId: number,
    userId: number,
  ) {
    // Confirma primeiro que o veículo pertence ao utilizador.
    const existingVehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!existingVehicle) {
      throw new Error("Veículo não encontrado.");
    }

    // Elimina o veículo.
    await this.vehicleRepository.deleteByIdAndUserId(
      vehicleId,
      userId,
    );

    // Devolve os dados do veículo eliminado.
    return existingVehicle;
  }
}