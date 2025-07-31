import { prisma } from "@/lib/prisma";
import { generateToken } from "@/utils/jwt";
import bcrypt from "bcrypt";
import { LoginInput, RegisterInput } from "./auth.schema";

export const registerUser = async (data: RegisterInput) => {
  if (!data.name || !data.email || !data.password) {
    throw new Error("Dados inválidos");
  }
  
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error("Email já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: data.role ?? "USER",
    },
  });

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
};

export const loginUser = async (data: LoginInput) => {
  if (!data.email || !data.password) {
    throw new Error("Credenciais inválidas");
  }

  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user || !user.password) {
    throw new Error("Credenciais inválidas");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error("Credenciais inválidas");
  }

  const token = generateToken({
    sub: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  });

  console.log(token);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
