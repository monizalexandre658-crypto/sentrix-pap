import {
  VehicleTrustService,
} from "./services/trust/vehicle-trust.service";

function printResult(
  title: string,
  result: ReturnType<
    VehicleTrustService["evaluate"]
  >,
) {
  console.log();
  console.log("---------------------------------");
  console.log(title);
  console.log("---------------------------------");

  console.log(
    `Pontuação: ${result.score}`,
  );

  console.log(
    `Estado: ${result.state}`,
  );

  console.log(
    "Sinais:",
    result.signals,
  );

  console.log(
    "Explicações:",
  );

  for (
    const explanation of result.explanations
  ) {
    console.log(
      `- ${explanation}`,
    );
  }
}

function main() {
  console.log("=================================");
  console.log("SentriX Trust Engine");
  console.log("=================================");

  const trustService =
    new VehicleTrustService();

  const vehicleId = 31;

  const normal =
    trustService.evaluate(
      vehicleId,
      [],
    );

  printResult(
    "TESTE 1 — NORMAL",
    normal,
  );

  const suspicious =
    trustService.evaluate(
      vehicleId,
      [
        "MOVEMENT_DETECTED",
      ],
    );

  printResult(
    "TESTE 2 — SUSPEITO",
    suspicious,
  );

  const critical =
    trustService.evaluate(
      vehicleId,
      [
        "MOVEMENT_DETECTED",
        "IGNITION_ON",
        "GEOFENCE_EXIT",
      ],
    );

  printResult(
    "TESTE 3 — CRÍTICO",
    critical,
  );

  const probableTheft =
    trustService.evaluate(
      vehicleId,
      [
        "MOVEMENT_DETECTED",
        "IGNITION_ON",
        "GEOFENCE_EXIT",
        "TAMPER_DETECTED",
      ],
    );

  printResult(
    "TESTE 4 — ROUBO PROVÁVEL",
    probableTheft,
  );

  console.log();
  console.log("=================================");
  console.log("TESTES CONCLUÍDOS");
  console.log("=================================");
}

main();