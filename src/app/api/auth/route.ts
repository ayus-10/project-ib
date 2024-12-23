import {
  BadRequest,
  InternalServerError,
  NotFound,
  Ok,
  Unauthorized,
} from "@/utils/httpResponses";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { getTokenSecrets } from "../helpers";

const prisma = new PrismaClient();

interface LoginUserDTO {
  email: string;
  password: string;
}

// login user
export async function POST(request: Request) {
  try {
    const [ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET] = getTokenSecrets();

    const { email, password } = (await request.json()) as LoginUserDTO;

    if (!email || !password) {
      return BadRequest("Please provide all the values.");
    }

    const userFound = await prisma.user.findFirst({ where: { email } });
    if (!userFound) {
      return Unauthorized("No user found with that email.");
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);
    if (!passwordMatch) {
      return Unauthorized("The password is incorrect.");
    }

    const { id, role } = userFound;
    const accessToken = jwt.sign({ id, email, role }, ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign({ id, email, role }, REFRESH_TOKEN_SECRET, {
      expiresIn: "1w",
    });

    const cookieStore = await cookies();

    cookieStore.set({
      name: "refreshToken",
      value: refreshToken,
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return Ok({ accessToken });
  } catch (error) {
    return InternalServerError(error);
  }
}

// get user info
export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-id");
    const userEmail = request.headers.get("x-email");
    const userRole = request.headers.get("x-role");

    if (!userId || !userEmail || !userRole) {
      return Unauthorized("Please log in to continue.");
    }

    const user = await prisma.user.findFirst({
      where: { id: parseInt(userId) },
    });

    if (!user) {
      return NotFound("User not found in database.");
    }

    return Ok({
      id: userId,
      email: userEmail,
      fullName: user.fullName,
      role: userRole,
    });
  } catch (error) {
    return InternalServerError(error);
  }
}
