import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../lib/jwt";
import { Prisma } from "../generated/prisma/client";
import { ValidationError } from "../errors/validation-error";

const NAME_MAX_LENGTH = 200;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(
    name: string,
    email: string,
    password: string,
  ) {
    if (!isNonEmptyString(name)) {
      throw new ValidationError("O nome é obrigatório.");
    }

    const trimmedName = name.trim();

    if (trimmedName.length > NAME_MAX_LENGTH) {
      throw new ValidationError(
        `O nome não pode ter mais de ${NAME_MAX_LENGTH} caracteres.`,
      );
    }

    if (!isNonEmptyString(email)) {
      throw new ValidationError("O email é obrigatório.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      throw new ValidationError("O formato do email é inválido.");
    }

    if (typeof password !== "string" || password.length === 0) {
      throw new ValidationError("A palavra-passe é obrigatória.");
    }

    if (password.length < PASSWORD_MIN_LENGTH) {
      throw new ValidationError(
        `A palavra-passe deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`,
      );
    }

    if (Buffer.byteLength(password, "utf8") > PASSWORD_MAX_BYTES) {
      throw new ValidationError(
        "A palavra-passe é demasiado longa.",
      );
    }

    const existingUser =
      await this.userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ValidationError("Já existe uma conta com este email.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const user = await this.userRepository.create(
        trimmedName,
        normalizedEmail,
        passwordHash,
      );

      return user;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ValidationError("Já existe uma conta com este email.");
      }

      throw error;
    }
  }

  async login(
    email: string,
    password: string,
  ) {
    if (!isNonEmptyString(email)) {
      throw new ValidationError("Email ou palavra-passe inválidos.");
    }

    if (typeof password !== "string" || password.length === 0) {
      throw new ValidationError("Email ou palavra-passe inválidos.");
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user =
      await this.userRepository.findByEmail(normalizedEmail);

    if (!user) {
      throw new ValidationError("Email ou palavra-passe inválidos.");
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new ValidationError("Email ou palavra-passe inválidos.");
    }

    const token = generateToken(user.id);

    return {
      user,
      token,
    };
  }

  async getUserById(id: number) {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new ValidationError("Utilizador não encontrado.");
    }

    return user;
  }
}
