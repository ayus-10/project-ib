import { ACCESS_TOKEN } from "@/constants";
import axios from "axios";

interface AuthenticatedUserResponse {
  email: string;
  fullName: string;
  role: string;
}

export default async function getAuthenticatedUser() {
  try {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    const res = await axios.get<AuthenticatedUserResponse>("/api/auth", {
      headers: { Authorization: `Bearer ${accessToken}` },
      withCredentials: true,
    });

    return res;
  } catch (error) {
    throw error;
  }
}
