import { Router } from "express";
import { createUser, getUser } from "../controllers/user.controller";

const UserRouter: Router = Router();

UserRouter.use("/create", createUser);
UserRouter.use("/getUser", getUser);

export default UserRouter;
