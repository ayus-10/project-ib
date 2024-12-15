import { ACCESS_TOKEN } from "@/constants";
import { AuthResponse } from "@/interfaces/AuthResponse";
import axios from "axios";

export default async function refreshTokens() {
  try {
    const res = await axios.post<AuthResponse>("/api/auth/refresh", undefined, {
      withCredentials: true,
    });

    localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
  } catch (error) {
    // TODO: user should be logged out here
    console.log("Unable to refresh tokens: ", error);
  }
}
