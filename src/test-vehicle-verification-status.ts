import { prisma } from "./lib/prisma";

async function main() {
  console.log("=================================");
  console.log("SentriX Verification Status");
  console.log("=================================");
  console.log();

  const vehicleId = 31;

  const vehicle =
    await prisma.vehicle.findUnique({
      where: {
        id: vehicleId,
      },
      select: {
        id: true,
        brand: true,
        model: true,
        plate: true,
        country: true,
        color: true,
        verificationStatus: true,
        verificationDate: true,
        verificationNotes: true,
      },
    });

  if (!vehicle) {
    console.log("Veículo não encontrado.");
    return;
  }

  console.log("Veículo encontrado:");
  console.log();

  console.log("ID:", vehicle.id);
  console.log("Marca:", vehicle.brand);
  console.log("Modelo:", vehicle.model);
  console.log("Matrícula:", vehicle.plate);
  console.log("País:", vehicle.country);
  console.log("Cor:", vehicle.color);

  console.log();
  console.log("=================================");
  console.log("ESTADO DA VERIFICAÇÃO");
  console.log("=================================");

  console.log(
    "Estado:",
    vehicle.verificationStatus,
  );

  console.log(
    "Data:",
    vehicle.verificationDate,
  );

  console.log(
    "Notas:",
    vehicle.verificationNotes,
  );

  console.log();
  console.log("=================================");

  if (
    vehicle.verificationStatus ===
    "VERIFIED"
  ) {
    console.log(
      "✓ VERIFICAÇÃO GRAVADA NO POSTGRESQL",
    );
  } else {
    console.log(
      "✗ VERIFICAÇÃO NÃO ESTÁ COMO VERIFIED",
    );
  }

  console.log("=================================");
}

main()
  .catch((error) => {
    console.error();
    console.error(
      "Erro ao consultar o PostgreSQL:",
    );
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });