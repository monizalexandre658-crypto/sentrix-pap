import { prisma } from "./lib/prisma";

async function main() {
  console.log("=================================");
  console.log("SentriX — Vehicle Ownership Test");
  console.log("=================================\n");

  const vehicles = await prisma.vehicle.findMany({
    select: {
      id: true,
      brand: true,
      model: true,
      plate: true,
      userId: true,
      verificationStatus: true,
    },
    orderBy: {
      id: "asc",
    },
  });

  if (vehicles.length === 0) {
    console.log("Nenhum veículo encontrado.");
    return;
  }

  console.log("Veículos encontrados:\n");

  for (const vehicle of vehicles) {
    console.log(
      `ID: ${vehicle.id} | ` +
      `Utilizador: ${vehicle.userId} | ` +
      `${vehicle.brand} ${vehicle.model} | ` +
      `${vehicle.plate} | ` +
      `Estado: ${vehicle.verificationStatus}`,
    );
  }

  console.log("\n=================================");
  console.log(`Total de veículos: ${vehicles.length}`);
  console.log("=================================");
}

main()
  .catch((error) => {
    console.error("Erro:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });