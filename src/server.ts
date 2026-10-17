import "dotenv/config";
import app from "./app";

const rawPort = process.env.PORT;
const PORT = rawPort !== undefined ? Number(rawPort) : 3000;

if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) {
  console.error(`Porta inválida: "${rawPort}". Deve ser um inteiro entre 1 e 65535.`);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`SentriX API running on http://localhost:${PORT}`);
});