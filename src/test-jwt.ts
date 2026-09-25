import "dotenv/config";
import { generateToken } from "./lib/jwt";

const token = generateToken(4);

console.log("✅ JWT criado com sucesso:");
console.log(token);