import { Router } from "express";
import { Register } from "../controllers/auth.controller";

const AuthRouter = Router();

AuthRouter.post("/register", Register);

export default AuthRouter;
