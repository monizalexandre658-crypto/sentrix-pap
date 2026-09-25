import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

if (typeof jwtSecret !== "string" || jwtSecret.length === 0) {
  throw new Error("JWT_SECRET não está definida.");
}

export function generateToken(userId: number): string {
  return jwt.sign(
    { userId },
    jwtSecret!,
    { expiresIn: "1h" },
  );
}