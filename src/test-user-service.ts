import { prisma } from "./lib/prisma";
import { UserService } from "./services/user.service";

async function testLogin() {
  const userService = new UserService();

  try {
    const user = await userService.login(
      "teste@sentrix.local",
      "password-invalida-teste!",
    );

    console.log("✅ Login realizado com sucesso:");
    console.log(user);
  } catch (error) {
    console.error("❌ Erro no login:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testLogin();