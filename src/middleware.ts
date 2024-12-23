import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { ADMIN } from "./constants";
import { jwtVerify } from "jose";
import { MyJwtPayload } from "./interfaces/MyJwtPayload";
import { BadRequest } from "./utils/httpResponses";
import { getTokenSecrets } from "./app/api/helpers";
import { BadRequestError, ClientError } from "./utils/customErrors";

export async function middleware(request: NextRequest) {
  const isAdminOnlyRoute =
    request.nextUrl.pathname.startsWith("/api/job") && request.method !== "GET";

  // check for access and refresh tokens to determine if user is logged in
  try {
    const [ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET] = getTokenSecrets();
    const refreshTokenSecret = new TextEncoder().encode(REFRESH_TOKEN_SECRET);
    const accessTokenSecret = new TextEncoder().encode(ACCESS_TOKEN_SECRET);

    const refreshTokenCookie = request.cookies.get("refreshToken");

    if (!refreshTokenCookie || !refreshTokenCookie.value) {
      throw new ClientError("Invalid refresh token in cookie.");
    }

    await jwtVerify(refreshTokenCookie.value, refreshTokenSecret);

    const authHeader = request.headers.get("authorization");

    if (!authHeader || authHeader.split(" ").length !== 2) {
      throw new ClientError("Invalid authorization header.");
    }

    const accessToken = authHeader.split(" ")[1];

    const { payload } = await jwtVerify(accessToken, accessTokenSecret);
    const { id, email, role } = payload as MyJwtPayload;

    const response = NextResponse.next();

    response.headers.set("x-id", id.toString());
    response.headers.set("x-email", email);
    response.headers.set("x-role", role);

    if (role !== ADMIN && isAdminOnlyRoute) {
      throw new BadRequestError("Only admins can access this URL.");
    }

    return response;
  } catch (error) {
    if (error instanceof BadRequestError) {
      return BadRequest(error.message);
    }
    if (error instanceof ClientError) {
      return NextResponse.next();
    }

    console.log("Error in middleware: ", error);
    return NextResponse.next();
  }
}
