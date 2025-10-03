import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { executeLLM } from "../llm/index.llm";
import { ACCOUNT_SETUP } from "../validators/llm.validation";

export async function userBusinessSetup(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = ACCOUNT_SETUP.parse(body);
    const response = await executeLLM(payload.websiteUrl, payload.userId);

    return res
      .status(200)
      .json({ message: "Your account has been setup successfully" });
  } catch (error) {
    if (error instanceof ZodError) {
      const flatError = z.flattenError(error);
      return res.status(400).json({
        message: "An Error Occured while account setup",
        error: flatError,
      });
    }

    return res
      .status(400)
      .json({ message: "An Error Occured while account setup", error });
  }
}
