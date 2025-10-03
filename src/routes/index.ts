import { Router } from "express";
import AuthRouter from "../services/auth.service";
import BusinessRouter from "../services/business.service";
import LLMRouter from "../services/llm.service";
const RouteHandler: Router = Router();

RouteHandler.use("/api/v1/business", BusinessRouter);
RouteHandler.use("/api/v1/auth", AuthRouter);
RouteHandler.use("/api/v1/setup", LLMRouter);

export default RouteHandler;
