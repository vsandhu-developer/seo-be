import cors from "cors";
import express, {
  urlencoded,
  type Application,
  type Request,
  type Response,
} from "express";
import RouteHandler from "./src/routes";

const PORT = process.env.PORT! || 3001;
const app: Application = express();

app.use(express.json());
app.use(urlencoded({ extended: false }));
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Routes
app.use(RouteHandler);

app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ message: "PASS" });
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);

// // await executeLLM();
// const dummyData = JSON.stringify(blogData);
// await generateBlogLLM(dummyData);
