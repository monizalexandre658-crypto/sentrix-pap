import {
  VehicleEventService,
} from "../events/vehicle-event.service";

export type TrustState =
  | "NORMAL"
  | "SUSPEITO"
  | "CRITICO"
  | "ROUBO_PROVAVEL";

export type TrustSignal =
  | "MOVEMENT_DETECTED"
  | "IGNITION_ON"
  | "GEOFENCE_EXIT"
  | "GNSS_LOST"
  | "OWNER_NOT_AUTHORIZED"
  | "COMMUNICATION_LOST"
  | "TAMPER_DETECTED"
  | "THEFT_BUTTON";

interface TrustRule {
  points: number;
  description: string;
}

export interface TrustEvaluation {
  vehicleId: number;

  score: number;

  state: TrustState;

  signals: string[];

  explanations: string[];
}

export class VehicleTrustService {
  private readonly eventService: VehicleEventService;

  private readonly rules: Record<
    TrustSignal,
    TrustRule
  > = {
    MOVEMENT_DETECTED: {
      points: 20,
      description:
        "Movimento inesperado detectado.",
    },

    IGNITION_ON: {
      points: 20,
      description:
        "Ignição ligada inesperadamente.",
    },

    GEOFENCE_EXIT: {
      points: 25,
      description:
        "Veículo saiu da zona autorizada.",
    },

    GNSS_LOST: {
      points: 15,
      description:
        "Sinal GNSS perdido.",
    },

    OWNER_NOT_AUTHORIZED: {
      points: 20,
      description:
        "Proprietário não autorizado.",
    },

    COMMUNICATION_LOST: {
      points: 15,
      description:
        "Comunicação com o dispositivo perdida.",
    },

    TAMPER_DETECTED: {
      points: 30,
      description:
        "Tentativa de manipulação ou remoção detectada.",
    },

    THEFT_BUTTON: {
      points: 50,
      description:
        "Botão anti-roubo acionado.",
    },
  };

  constructor(
    eventService?: VehicleEventService,
  ) {
    this.eventService =
      eventService ??
      new VehicleEventService();
  }

  evaluate(
    vehicleId: number,
    signals: TrustSignal[],
  ): TrustEvaluation {
    if (
      !vehicleId ||
      vehicleId <= 0
    ) {
      throw new Error(
        "ID do veículo inválido.",
      );
    }

    if (!signals.length) {
      return {
        vehicleId,
        score: 0,
        state: "NORMAL",
        signals: [],
        explanations: [],
      };
    }

    let score = 0;

    const explanations: string[] = [];

    const uniqueSignals =
      [...new Set(signals)];

    for (const signal of uniqueSignals) {
      const rule =
        this.rules[signal];

      if (!rule) {
        continue;
      }

      score += rule.points;

      explanations.push(
        rule.description,
      );
    }

    const state =
      this.calculateState(score);

    return {
      vehicleId,
      score,
      state,
      signals: uniqueSignals,
      explanations,
    };
  }

  private calculateState(
    score: number,
  ): TrustState {
    if (score >= 75) {
      return "ROUBO_PROVAVEL";
    }

    if (score >= 50) {
      return "CRITICO";
    }

   if (score >= 20) {
  return "SUSPEITO";
}

    return "NORMAL";
  }
}