import {
  VehicleEventRepository,
  CreateVehicleEventData,
} from "../../repositories/events/vehicle-event.repository";

export class VehicleEventService {
  private readonly repository: VehicleEventRepository;

  constructor(repository?: VehicleEventRepository) {
    this.repository = repository ?? new VehicleEventRepository();
  }

  async createEvent(data: CreateVehicleEventData) {
    if (!data.vehicleId || data.vehicleId <= 0) {
      throw new Error("ID do veículo inválido.");
    }

    if (!data.type) {
      throw new Error("Tipo de evento não fornecido.");
    }

    if (!data.source) {
      throw new Error("Origem do evento não fornecida.");
    }

    return this.repository.create(data);
  }

  async getEventById(id: number) {
    if (!id || id <= 0) {
      throw new Error("ID do evento inválido.");
    }

    return this.repository.findById(id);
  }

  async getVehicleEvents(vehicleId: number) {
    if (!vehicleId || vehicleId <= 0) {
      throw new Error("ID do veículo inválido.");
    }

    return this.repository.findByVehicleId(vehicleId);
  }

  async getRecentVehicleEvents(
    vehicleId: number,
    limit: number = 20,
  ) {
    if (!vehicleId || vehicleId <= 0) {
      throw new Error("ID do veículo inválido.");
    }

    if (limit <= 0) {
      throw new Error("O limite deve ser superior a zero.");
    }

    return this.repository.findRecentByVehicleId(vehicleId, limit);
  }
}