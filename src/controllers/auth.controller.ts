import type { Request, Response } from "express";
import z, { ZodError } from "zod";
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
