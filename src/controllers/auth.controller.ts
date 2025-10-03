import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { prisma } from "../config/db.config";
import { LOGIN_USER } from "../validators/user.validations";
import { createUser } from "./user.controller";

export async function Register(req: Request, res: Response) {
  try {
    const response = await createUser(req, res);

    return res.status(200).json({ message: "Account Created Successfully" });
  } catch (error) {
    const flattError = z.flattenError(error as any);

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error Occured", error: flattError });
    }
    return res.status(400).json({ message: "Error While Creating Account" });
  }
}

export async function Login(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = LOGIN_USER.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }

    const verifyPassword = await bcrypt.compare(
      payload.password,
      user.password
    );

    if (!verifyPassword) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }

    return res.status(200).json({ user: user });
  } catch (error) {
    const flattError = z.flattenError(error as any);

    if (error instanceof ZodError) {
      return res
        .status(400)
        .json({ message: "Validation Error Occured", error: flattError });
    }
    return res.status(400).json({ message: "Error While Creating Account" });
  }
}
