import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ACCESS_TOKEN_SECRET, ADMIN, REFRESH_TOKEN_SECRET } from "./constants";
import { jwtVerify } from "jose";
import { MyJwtPayload } from "./interfaces/MyJwtPayload";
import { BadRequest } from "./utils/httpResponses";

export async function middleware(request: NextRequest) {
  const isAdminOnlyRoute =
    request.nextUrl.pathname.startsWith("/api/job") && request.method !== "GET";

  // check for access and refresh tokens to determine if user is logged in
  try {
    if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
      throw new Error("JWT secrets are not available.");
    }
    const refreshTokenSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);
    const accessTokenSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

    const refreshTokenCookie = request.cookies.get("refreshToken");

    if (!refreshTokenCookie || !refreshTokenCookie.value) {
      throw new Error("Invalid refresh token in cookie.");
    }

    await jwtVerify(refreshTokenCookie.value, refreshTokenSecret);

    const authHeader = request.headers.get("authorization");

    if (!authHeader || authHeader.split(" ").length !== 2) {
      throw new Error("Invalid auth header.");
    }

    const accessToken = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(accessToken, accessTokenSecret);
    const { id, email, role } = payload as MyJwtPayload;

    const response = NextResponse.next();

    response.headers.set("x-id", id.toString());
    response.headers.set("x-email", email);
    response.headers.set("x-role", role);

    const isAdmin = role === ADMIN;

    if (!isAdmin && isAdminOnlyRoute) {
      throw new Error("Only admins can access this URL.");
    }

    return response;
  } catch {
    if (isAdminOnlyRoute) {
      return BadRequest("Only admins can access this URL.");
    }
    return NextResponse.next();
  }
}
