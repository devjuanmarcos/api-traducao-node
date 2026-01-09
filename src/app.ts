import express, { Application } from "express";
import { jsonMiddleware } from "./middlewares/jsonMiddleware";
import router from "./routes/translationRoutes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const app: Application = express();

// Definindo um tempo de timeout para todas as requisições (em milissegundos)
app.use((req, res, next) => {
  res.setTimeout(300000, () => {
    // 300000 ms = 5 minutos
    console.log("Requisição demorou mais de 5 minutos.");
  });
  next();
});

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "Esta é a documentação da minha API",
    },
    servers: [
      {
        url: "https://api-traducao-node.vercel.app",
      },
    ],
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

// Gerar a documentação Swagger a partir dos JSDoc
const swaggerDocs = swaggerJSDoc(swaggerOptions);

// Configurar o Swagger UI no caminho /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(jsonMiddleware);
app.use("/api", router);

export default app;
