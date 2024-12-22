import { InternalServerError, Ok, Unauthorized } from "@/utils/httpResponses";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { MyJwtPayload } from "@/interfaces/MyJwtPayload";
import { getTokenSecrets } from "../../helpers";

// refresh jwt tokens
export async function POST() {
  try {
    const [ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET] = getTokenSecrets();

    const cookieStore = await cookies();
    const refreshTokenCookie = cookieStore.get("refreshToken");

    if (!refreshTokenCookie || !refreshTokenCookie.value) {
      return Unauthorized("Please log in to continue.");
    }

    const { id, email, role } = jwt.verify(
      refreshTokenCookie.value,
      REFRESH_TOKEN_SECRET
    ) as MyJwtPayload;

    const newAccessToken = jwt.sign({ id, email, role }, ACCESS_TOKEN_SECRET, {
      expiresIn: "5m",
    });
    const newRefreshToken = jwt.sign(
      { id, email, role },
      REFRESH_TOKEN_SECRET,
      {
        expiresIn: "1w",
      }
    );

    cookieStore.set({
      name: "refreshToken",
      value: newRefreshToken,
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    return Ok({ accessToken: newAccessToken });
  } catch (error) {
    if (
      error instanceof jwt.JsonWebTokenError ||
      error instanceof jwt.TokenExpiredError
    ) {
      return Unauthorized("Token is either invalid or expired.");
    }
    return InternalServerError(error);
  }
}
