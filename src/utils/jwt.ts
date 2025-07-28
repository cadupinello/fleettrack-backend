import dotenv from 'dotenv';
import jwt from "jsonwebtoken";


dotenv.config()

const JWT_SECRET = process.env.JWT_SECRET!;

console.log(JWT_SECRET);

export const generateToken = (payload: object) => {
  console.log(payload, JWT_SECRET);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, JWT_SECRET);
};
