
import { VehicleRepository } from "../../repositories/vehicle.repository";

export interface ExtractedVehicleData {
  plate: string | null;
  brand: string | null;
  model: string | null;
  color: string | null;
  country: string | null;
}

export interface VehicleVerificationResult {
  verified: boolean;

  matches: {
    plate: boolean;
    brand: boolean;
    model: boolean;
    color: boolean;
    country: boolean;
  };

  document: ExtractedVehicleData;

  vehicle: {
    plate: string;
    brand: string;
    model: string;
    color: string | null;
    country: string | null;
  };
}

export class VehicleDocumentVerificationService {
  private vehicleRepository: VehicleRepository;

  constructor() {
    this.vehicleRepository =
      new VehicleRepository();
  }

  async verify(
    vehicleId: number,
    userId: number,
    documentData: ExtractedVehicleData,
  ): Promise<VehicleVerificationResult> {
    const vehicle =
      await this.vehicleRepository.findByIdAndUserId(
        vehicleId,
        userId,
      );

    if (!vehicle) {
      throw new Error(
        "Veículo não encontrado ou não pertence ao utilizador.",
      );
    }

    const plateMatch =
      this.normalize(vehicle.plate) ===
      this.normalize(documentData.plate);

    const brandMatch =
      this.normalize(vehicle.brand) ===
      this.normalize(documentData.brand);

    const modelMatch =
      this.normalize(vehicle.model) ===
      this.normalize(documentData.model);

    const colorMatch =
      this.normalize(vehicle.color) ===
      this.normalize(documentData.color);

    const countryMatch =
      this.normalize(vehicle.country) ===
      this.normalize(documentData.country);

    const verified =
      plateMatch &&
      brandMatch &&
      modelMatch &&
      colorMatch &&
      countryMatch;

    const mismatches: string[] = [];

    if (!plateMatch) {
      mismatches.push("matrícula");
    }

    if (!brandMatch) {
      mismatches.push("marca");
    }

    if (!modelMatch) {
      mismatches.push("modelo");
    }

    if (!colorMatch) {
      mismatches.push("cor");
    }

    if (!countryMatch) {
      mismatches.push("país");
    }

    const verificationStatus = verified
      ? "VERIFIED"
      : "REJECTED";

    const verificationNotes = verified
      ? "Todos os dados do documento coincidem com os dados registados no veículo."
      : `Documento rejeitado. Diferenças encontradas: ${mismatches.join(", ")}.`;

    await this.vehicleRepository.updateVerification(
      vehicleId,
      userId,
      {
        verificationStatus,
        verificationDate: new Date(),
        verificationNotes,
      },
    );

    return {
      verified,

      matches: {
        plate: plateMatch,
        brand: brandMatch,
        model: modelMatch,
        color: colorMatch,
        country: countryMatch,
      },

      document: documentData,

      vehicle: {
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        color: vehicle.color,
        country: vehicle.country,
      },
    };
  }

  private normalize(
    value: string | null | undefined,
  ): string {
    return (
      value
        ?.trim()
        .toUpperCase()
        .replace(/\s+/g, " ")
        .replace(/-/g, "") ?? ""
    );
  }
}
