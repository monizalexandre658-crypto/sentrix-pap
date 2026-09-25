import bcrypt from "bcrypt";
import { UserRepository } from "../repositories/user.repository";
import { generateToken } from "../lib/jwt";

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
    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error("Já existe uma conta com este email.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await this.userRepository.create(
      name,
      email,
      passwordHash,
    );

    return user;
  }

  async login(
    email: string,
    password: string,
  ) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Email ou palavra-passe inválidos.");
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      throw new Error("Email ou palavra-passe inválidos.");
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
      throw new Error("Utilizador não encontrado.");
    }

    return user;
  }
}