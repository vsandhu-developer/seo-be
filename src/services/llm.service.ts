import { Router } from "express";
import { userBusinessSetup } from "../controllers/llm.controller";

const LLMRouter = Router();

LLMRouter.post("/account-setup", userBusinessSetup);

export default LLMRouter;
