import { InternalServerError, Ok, Unauthorized } from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "@/constants";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

interface LoginUserDTO {
  email: string;
  password: string;
}

// login user
export async function POST(request: Request) {
  try {
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error(
        "Access or refresh token secrets not found in environments."
      );
    }

    const { email, password } = (await request.json()) as LoginUserDTO;

    const userFound = await prisma.user.findFirst({ where: { email } });
    if (!userFound) {
      return Unauthorized("No user found with that email.");
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) {
      return Unauthorized("The password is incorrect.");
    }

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

    return Ok({ accessToken });
  } catch (error) {
    return InternalServerError(error);
  }
}
