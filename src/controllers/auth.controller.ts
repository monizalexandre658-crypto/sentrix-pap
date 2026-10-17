import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { ValidationError } from "../errors/validation-error";

export class AuthController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async register(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const user = await this.userService.register(
        name,
        email,
        password,
      );

      const { passwordHash, ...safeUser } = user;

      return res.status(201).json({
        success: true,
        message: "Utilizador registado com sucesso.",
        user: safeUser,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(400).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Erro inesperado no registo:", error instanceof Error ? error.message : error);

      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro ao processar o pedido.",
      });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const result = await this.userService.login(
        email,
        password,
      );

      const { passwordHash, ...safeUser } = result.user;

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso.",
        token: result.token,
        user: safeUser,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Erro inesperado no login:", error instanceof Error ? error.message : error);

      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro ao processar o pedido.",
      });
    }
  }

  async me(req: Request, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: "Utilizador não autenticado.",
        });
      }

      const user = await this.userService.getUserById(userId);

      const { passwordHash, ...safeUser } = user;

      return res.status(200).json({
        success: true,
        message: "Utilizador autenticado.",
        user: safeUser,
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        return res.status(401).json({
          success: false,
          message: error.message,
        });
      }

      console.error("Erro inesperado em /me:", error instanceof Error ? error.message : error);

      return res.status(500).json({
        success: false,
        message: "Ocorreu um erro ao processar o pedido.",
      });
    }
  }
}
