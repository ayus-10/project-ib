import { InternalServerError, Ok } from "@/utils/httpResponses";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("refreshToken");
    return Ok("Logged out successfully.");
  } catch (error) {
    return InternalServerError(error);
  }
}
