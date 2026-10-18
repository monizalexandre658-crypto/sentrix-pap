
export type ImmobilizerState =
  | "UNLOCKED"
  | "LOCK_PENDING"
  | "LOCKED"
  | "UNLOCK_PENDING"
  | "OFFLINE"
  | "FAULT";

type OnlineState =
  | "UNLOCKED"
  | "LOCK_PENDING"
  | "LOCKED"
  | "UNLOCK_PENDING";

export interface ImmobilizerStatus {
  vehicleId: number;
  state: ImmobilizerState;
  online: boolean;
  vehicleMoving: boolean;
  updatedAt: string;
  lastCommand: "LOCK" | "UNLOCK" | null;
  message: string;
}

export class ImmobilizerSimulatorService {
  private readonly devices = new Map<number, ImmobilizerStatus>();
  private readonly previousStates = new Map<number, OnlineState>();


  private getDevice(vehicleId: number): ImmobilizerStatus {
    if (!Number.isInteger(vehicleId) || vehicleId <= 0) {
      throw new Error("ID do veículo inválido.");
    }

    let device = this.devices.get(vehicleId);

    if (!device) {
      device = {
        vehicleId,
        state: "UNLOCKED",
        online: true,
        vehicleMoving: false,
        updatedAt: new Date().toISOString(),
        lastCommand: null,
        message: "Simulador inicializado; sem bloqueio.",
      };

      this.devices.set(vehicleId, device);
    }

    return device;
  }


  getStatus(vehicleId: number): ImmobilizerStatus {
    return { ...this.getDevice(vehicleId) };
  }


  setVehicleMoving(
    vehicleId: number,
    moving: boolean,
  ): ImmobilizerStatus {
    const device = this.getDevice(vehicleId);

    device.vehicleMoving = moving;
    device.updatedAt = new Date().toISOString();

    if (moving) {
      device.message =
        "Veículo em movimento. Não é permitido bloquear.";

      if (device.state === "LOCK_PENDING") {
        device.state = "UNLOCKED";
        device.lastCommand = null;
        device.message =
          "Bloqueio cancelado porque foi detetado movimento.";
      }
    } else {
      device.message = "Estado de movimento atualizado.";
    }

    return { ...device };
  }


  setOnline(
    vehicleId: number,
    online: boolean,
  ): ImmobilizerStatus {
    const device = this.getDevice(vehicleId);

    if (!online) {
      if (device.online) {
        const previousState: OnlineState =
          device.state === "LOCKED" ||
          device.state === "LOCK_PENDING" ||
          device.state === "UNLOCK_PENDING" ||
          device.state === "UNLOCKED"
            ? device.state
            : "UNLOCKED";

        this.previousStates.set(vehicleId, previousState);
      }

      device.online = false;
      device.state = "OFFLINE";
      device.message =
        "Dispositivo offline. Estado físico não confirmado.";
    } else {
      device.online = true;

      const previousState =
        this.previousStates.get(vehicleId) ?? "UNLOCKED";

      if (
        previousState === "LOCK_PENDING" ||
        previousState === "UNLOCK_PENDING"
      ) {
        device.state = "FAULT";
        device.message =
          "Ligação recuperada, mas é necessária uma nova confirmação.";
      } else {
        device.state = previousState;
        device.message = "Ligação simulada recuperada.";
      }

      this.previousStates.delete(vehicleId);
    }

    device.updatedAt = new Date().toISOString();

    return { ...device };
  }


  requestLock(vehicleId: number): ImmobilizerStatus {
    const device = this.getDevice(vehicleId);

    if (!device.online) {
      throw new Error(
        "Dispositivo offline. Não é possível enviar o comando.",
      );
    }

    if (device.vehicleMoving) {
      throw new Error(
        "Bloqueio recusado: o veículo está em movimento.",
      );
    }

    if (device.state === "FAULT") {
      throw new Error(
        "Dispositivo em falha. É necessária uma verificação.",
      );
    }

    if (device.state === "LOCKED") {
      return { ...device };
    }

    if (device.state === "LOCK_PENDING") {
      return { ...device };
    }

    device.state = "LOCK_PENDING";
    device.lastCommand = "LOCK";
    device.message =
      "Bloqueio solicitado. Aguarda confirmação simulada.";
    device.updatedAt = new Date().toISOString();

    return { ...device };
  }


  requestUnlock(vehicleId: number): ImmobilizerStatus {
    const device = this.getDevice(vehicleId);

    if (!device.online) {
      throw new Error(
        "Dispositivo offline. Não é possível enviar o comando.",
      );
    }

    if (device.state === "FAULT") {
      throw new Error(
        "Dispositivo em falha. É necessária uma verificação.",
      );
    }

    if (device.state === "UNLOCKED") {
      return { ...device };
    }

    if (device.state === "UNLOCK_PENDING") {
      return { ...device };
    }

    device.state = "UNLOCK_PENDING";
    device.lastCommand = "UNLOCK";
    device.message =
      "Desbloqueio solicitado. Aguarda confirmação simulada.";
    device.updatedAt = new Date().toISOString();

    return { ...device };
  }

  confirmCommand(vehicleId: number): ImmobilizerStatus {
    const device = this.getDevice(vehicleId);

    if (!device.online) {
      throw new Error(
        "Não é possível confirmar: dispositivo offline.",
      );
    }

    if (device.state === "LOCK_PENDING") {
      if (device.vehicleMoving) {
        device.state = "FAULT";
        device.message =
          "Confirmação recusada: veículo em movimento.";
      } else {
        device.state = "LOCKED";
        device.message =
          "Bloqueio confirmado pelo simulador.";
      }
    } else if (device.state === "UNLOCK_PENDING") {
      device.state = "UNLOCKED";
      device.message =
        "Desbloqueio confirmado pelo simulador.";
    } else {
      throw new Error(
        "Não existe nenhum comando pendente para confirmar.",
      );
    }

    device.updatedAt = new Date().toISOString();

    return { ...device };
  }


  setFault(vehicleId: number): ImmobilizerStatus {
    const device = this.getDevice(vehicleId);

    device.state = "FAULT";
    device.message =
      "Falha simulada. O estado físico não está confirmado.";
    device.updatedAt = new Date().toISOString();

    return { ...device };
  }
}