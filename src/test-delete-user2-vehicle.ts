import { prisma } from "./lib/prisma";

async function main() {
  const vehicleId = 32;

  const vehicle = await prisma.vehicle.findUnique({
    where: {
      id: vehicleId,
    },
  });

  if (!vehicle) {
    console.log("Veículo 32 não encontrado.");
    return;
  }

  await prisma.vehicle.delete({
    where: {
      id: vehicleId,
    },
  });

  console.log("=================================");
  console.log("LIMPEZA CONCLUÍDA");
  console.log("=================================");
  console.log(`Veículo ${vehicleId} eliminado.`);
  console.log(`Matrícula: ${vehicle.plate}`);
  console.log(`Utilizador: ${vehicle.userId}`);
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