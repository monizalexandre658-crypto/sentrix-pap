import { prisma } from "./lib/prisma";

async function main() {
  const userId = 2;

  const vehicle = await prisma.vehicle.create({
    data: {
      brand: "TESTE",
      model: "ISOLAMENTO",
      plate: "TEST-02",
      color: "Preto",
      country: "PT",
      userId,
    },
  });

  console.log("=================================");
  console.log("VEÍCULO TEMPORÁRIO CRIADO");
  console.log("=================================");
  console.log(`ID: ${vehicle.id}`);
  console.log(`Utilizador: ${vehicle.userId}`);
  console.log(`Matrícula: ${vehicle.plate}`);
  console.log(`Estado: ${vehicle.verificationStatus}`);
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