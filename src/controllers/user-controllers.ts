import { NextFunction, Request, Response } from "express";
import { UserType } from "../../db/migrations/UserType";
import { knex } from "../database";
import bcrypt from "bcryptjs";

export class UserController {
  async index(req: Request, res: Response, next: NextFunction) {
    try {
      const allUsers = await knex<UserType>("user").select(
        "id",
        "login",
        "created_at"
      );

      res.status(200).json(allUsers);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;

      if (!login || !password) {
        return res
          .status(400)
          .json({ message: "Login e senha são obrigatórios." });
      }

      const hashedPassword = await bcrypt.hash(password, 8);

      const [user] = await knex("user")
        .insert({
          login,
          password: hashedPassword,
        })
        .returning(["id", "login", "created_at"]);

      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { login } = req.body;

      if (!login) {
        return res
          .status(400)
          .json({ message: "O campo 'login' é obrigatório." });
      }

      const updatedUser = await knex<UserType>("user")
        .select("id", "login", "updated_at")
        .where({ id })
        .first();

      if (!updatedUser) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }

      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const deletedCount = await knex<UserType>("user").where({ id }).del();

      if (deletedCount === 0) {
        return res.status(404).json({ message: "Usuário não encontrado." });
      }
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
