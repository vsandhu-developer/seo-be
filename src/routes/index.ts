import { Router } from "express";
import BusinessRouter from "../services/business.service";
import UserRouter from "../services/user.service";
const RouteHandler: Router = Router();

RouteHandler.use("/api/v1/user", UserRouter);
RouteHandler.use("/api/v1/business", BusinessRouter);

export default RouteHandler;
