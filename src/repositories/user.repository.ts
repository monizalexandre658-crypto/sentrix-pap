import { prisma } from "../lib/prisma";

export class UserRepository {
  async findByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async findById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async create(
    name: string,
    email: string,
    password: string,
  ) {
    return prisma.user.create({
      data: {
        name,
        email,
        passwordHash: password,
      },
    });
  }
}