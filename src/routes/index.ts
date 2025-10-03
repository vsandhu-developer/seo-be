import { Router } from "express";
import AuthRouter from "../services/auth.service";
import BlogRouter from "../services/blog.service";
import BusinessRouter from "../services/business.service";
import LLMRouter from "../services/llm.service";
const RouteHandler: Router = Router();

RouteHandler.use("/api/v1/business", BusinessRouter);
RouteHandler.use("/api/v1/auth", AuthRouter);
RouteHandler.use("/api/v1/llm", LLMRouter);
RouteHandler.use("/api/v1/blog", BlogRouter);

export default RouteHandler;
