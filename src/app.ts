import express, { Application } from "express";
import { jsonMiddleware } from "./middlewares/jsonMiddleware";
import router from "./routes/translationRoutes";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app: Application = express();

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Kikito API",
      version: "1.0.0",
      description: "A melhor e mais bonita API em Node.js",
    },
    basePath: "/",
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(jsonMiddleware);
app.use("/api", router);

export default app;
