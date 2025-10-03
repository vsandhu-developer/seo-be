import { Router } from "express";
import {
  createBusiness,
  getBusinessInfo,
} from "../controllers/business.controller";

const BusinessRouter: Router = Router();

BusinessRouter.use("/create", createBusiness);
BusinessRouter.use("/info", getBusinessInfo);

export default BusinessRouter;
