import express, { Application } from "express";
import { jsonMiddleware } from "./middlewares/jsonMiddleware";
import router from "./routes/translationRoutes";

const app: Application = express();

app.use(jsonMiddleware);
app.use("/api", router);

export default app;
