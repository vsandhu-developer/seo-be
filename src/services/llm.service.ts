import { Router } from "express";
import { userBusinessSetup } from "../controllers/llm.controller";

const LLMRouter = Router();

LLMRouter.use("/account-setup", userBusinessSetup);

export default LLMRouter;
