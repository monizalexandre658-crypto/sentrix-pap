import { prisma } from "./lib/prisma";

async function testDatabase() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    console.log("✅ SentriX está ligado ao PostgreSQL com sucesso.");
  } catch (error) {
    console.error("❌ Erro ao ligar ao PostgreSQL:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabase();