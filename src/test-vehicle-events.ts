import {
  VehicleEventService,
} from "./services/events/vehicle-event.service";

async function main() {
  console.log("=================================");
  console.log("SentriX Vehicle Event Test");
  console.log("=================================");
  console.log();

  const service =
    new VehicleEventService();

  const vehicleId = 31;

  console.log(
    `Veículo utilizado no teste: ${vehicleId}`,
  );

  console.log();
  console.log("1. A criar evento...");
  console.log();

  const event =
    await service.createEvent({
      vehicleId,

      type: "MOVEMENT_DETECTED",

      source: "DEVICE",

      latitude: 39.2367,

      longitude: -8.6859,

      speed: 35,

      previousTrustState: "NORMAL",

      newTrustState: "SUSPEITO",

      metadata: {
        test: true,
        description:
          "Primeiro evento de movimento do SentriX",
      },
    });

  console.log("Evento criado com sucesso.");
  console.log();

  console.log("ID do evento:");
  console.log(event.id);

  console.log();

  console.log("Objeto completo:");
  console.log(
    JSON.stringify(
      event,
      null,
      2,
    ),
  );

  console.log();
  console.log("=================================");
  console.log("2. A consultar eventos do veículo...");
  console.log("=================================");
  console.log();

  const events =
    await service.getVehicleEvents(
      vehicleId,
    );

  console.log(
    `Eventos encontrados: ${events.length}`,
  );

  console.log();

  for (const item of events) {
    console.log(
      `ID: ${item.id} | Tipo: ${item.type} | Origem: ${item.source}`,
    );
  }

  console.log();
  console.log("=================================");
  console.log("TESTE CONCLUÍDO");
  console.log("=================================");
}

main().catch((error) => {
  console.error();
  console.error(
    "Erro durante o teste de eventos:",
  );
  console.error(error);

  process.exit(1);
});