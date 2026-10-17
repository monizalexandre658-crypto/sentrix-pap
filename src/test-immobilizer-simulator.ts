
import {
  ImmobilizerSimulatorService,
} from "./services/immobilizer/immobilizer-simulator.service";

function assert(
  condition: boolean,
  message: string,
): void {
  if (!condition) {
    throw new Error(`FALHOU: ${message}`);
  }

  console.log(`OK: ${message}`);
}

function main(): void {
  const simulator = new ImmobilizerSimulatorService();
  const vehicleId = 999;

  console.log("SentriX — Testes do Imobilizador");
  console.log("--------------------------------");

  const initial = simulator.getStatus(vehicleId);

  assert(initial.state === "UNLOCKED", "Estado inicial UNLOCKED");

  simulator.requestLock(vehicleId);

  assert(
    simulator.getStatus(vehicleId).state === "LOCK_PENDING",
    "O pedido de bloqueio fica pendente",
  );

  simulator.confirmCommand(vehicleId);

  assert(
    simulator.getStatus(vehicleId).state === "LOCKED",
    "O simulador confirma o bloqueio",
  );

  simulator.requestUnlock(vehicleId);
  simulator.confirmCommand(vehicleId);

  assert(
    simulator.getStatus(vehicleId).state === "UNLOCKED",
    "O desbloqueio é confirmado",
  );

  simulator.setVehicleMoving(vehicleId, true);

  let movementLockRejected = false;

  try {
    simulator.requestLock(vehicleId);
  } catch {
    movementLockRejected = true;
  }

  assert(
    movementLockRejected,
    "O bloqueio é recusado durante o movimento",
  );

  simulator.setVehicleMoving(vehicleId, false);
  simulator.setOnline(vehicleId, false);

  assert(
    simulator.getStatus(vehicleId).state === "OFFLINE",
    "A perda de comunicação é identificada",
  );

  let offlineLockRejected = false;

  try {
    simulator.requestLock(vehicleId);
  } catch {
    offlineLockRejected = true;
  }

  assert(
    offlineLockRejected,
    "Os comandos são recusados quando o dispositivo está offline",
  );

  simulator.setOnline(vehicleId, true);

  assert(
    simulator.getStatus(vehicleId).state === "UNLOCKED",
    "A ligação é recuperada sem declarar um bloqueio inexistente",
  );

  console.log("--------------------------------");
  console.log("Testes concluídos.");
}

main();