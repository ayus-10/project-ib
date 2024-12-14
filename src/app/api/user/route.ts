import {
  BadRequest,
  Created,
  InternalServerError,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/constants";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
}

// create user
export async function POST(request: Request) {
  try {
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error(
        "Access or refresh token secrets not found in environments."
      );
    }

    const { email, fullName, password } =
      (await request.json()) as CreateUserDTO;

    if (!email || !fullName || !password) {
      return BadRequest("Please provide all the required fields.");
    }

    if (!validator.isEmail(email)) {
      return BadRequest("Please provide a valid email.");
    }

    if (!validator.isStrongPassword(password)) {
      return BadRequest(
        "Password: 8+ characters with uppercase, lowercase, numbers and symbols."
      );
    }

    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return BadRequest("User with that email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({
      data: {
        email,
        fullName,
        password: passwordHash,
      },
    });

    const accessToken = jwt.sign({ email }, ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ email }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1w",
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
    });

    return Created({ accessToken });
  } catch (error) {
    return InternalServerError(error);
  }
}
