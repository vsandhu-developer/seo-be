import { Router } from "express";
import { createBusiness } from "../controllers/business.controller";

const BusinessRouter: Router = Router();

BusinessRouter.use("/create", createBusiness);

export default BusinessRouter;
