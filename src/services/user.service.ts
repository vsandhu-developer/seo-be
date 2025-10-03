import { Router } from "express";
import { createUser, getUser } from "../controllers/user.controller";

const UserRouter: Router = Router();

UserRouter.post("/create", createUser);
UserRouter.get("/getUser", getUser);

export default UserRouter;
