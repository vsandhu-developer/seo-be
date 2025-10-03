import bcrypt from "bcryptjs";
import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { prisma } from "../config/db.config";
import { CREATE_USER, GET_USER } from "../validators/user.validations";

export async function createUser(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = CREATE_USER.parse(body);

    const existingUser = await prisma.user.findUnique({
      where: {
        email: payload.email,
      },
    });

    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this email Already Exist" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        username: payload.username,
        password: hashedPassword,
      },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Your account has been created successfully", user });
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

export async function getUser(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = GET_USER.parse(body);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      select: {
        username: true,
        email: true,
        createdAt: true,
        updatedAt: true,
      },
    });

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
