import { Router } from "express";
import { postBlog } from "../controllers/blog.controller";

const BlogRouter: Router = Router();

BlogRouter.post("/new", postBlog);

export default BlogRouter;
