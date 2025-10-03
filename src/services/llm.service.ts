import { Router } from "express";
import { generateBlog, userBusinessSetup } from "../controllers/llm.controller";

const LLMRouter = Router();

LLMRouter.post("/account-setup", userBusinessSetup);
LLMRouter.post("/generate-blog", generateBlog);

export default LLMRouter;
