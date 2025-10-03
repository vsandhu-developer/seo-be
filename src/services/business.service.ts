import { Router } from "express";
import {
  createBusiness,
  getBusinessInfo,
} from "../controllers/business.controller";

const BusinessRouter: Router = Router();

BusinessRouter.post("/create", createBusiness);
BusinessRouter.get("/info", getBusinessInfo);

export default BusinessRouter;
