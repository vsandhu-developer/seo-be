import { Router } from "express";
import { Register } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.use("/register", Register);

export default AuthRouter;
