import app from "./app";
import { PORT } from "./config/serverConfig";

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
