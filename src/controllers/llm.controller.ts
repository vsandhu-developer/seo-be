import type { Request, Response } from "express";
import z, { ZodError } from "zod";
import { prisma } from "../config/db.config";
import { generateBlogLLM } from "../llm/blog.llm";
import { executeLLM } from "../llm/index.llm";
import { ACCOUNT_SETUP, POST_BLOG } from "../validators/llm.validation";

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

export async function generateBlog(req: Request, res: Response) {
  try {
    const body = req.body;
    const payload = POST_BLOG.parse(body);

    const businessInfo = await prisma.business.findUnique({
      where: {
        userId: payload.userId,
      },
    });

    const userInfo = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
    });

    if (!userInfo) {
      return res.status(400).json({ message: "Unauthorized Access" });
    }

    if (!businessInfo) {
      return res.status(400).json({ message: "Please setup your account." });
    }

    const data = {
      userInfo,
      businessInfo,
    };

    const generateBlog = await generateBlogLLM(JSON.stringify(data));

    return res.status(200).json({ blogData: generateBlog });
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
