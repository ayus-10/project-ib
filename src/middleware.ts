import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ACCESS_TOKEN_SECRET } from "./constants";
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/api")) return NextResponse.next();

  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || authHeader.split(" ").length !== 2) {
      throw new Error("Invalid auth header.");
    }

    if (!ACCESS_TOKEN_SECRET) {
      throw new Error("Access token secret is not available.");
    }

    const authToken = authHeader.split(" ")[1];

    const secretKey = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

    const { payload } = await jwtVerify(authToken, secretKey);

    const response = NextResponse.next();

    response.headers.set("x-email", payload.email as string);

    return response;
  } catch (error) {
    console.log("Error in middleware: ", error);
    return NextResponse.next();
  }
}
