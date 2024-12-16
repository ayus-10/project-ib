import { ACCESS_TOKEN } from "@/constants";
import axios from "axios";

export default async function logoutUser() {
  try {
    await axios.post("/api/auth/logout", undefined, { withCredentials: true });
    localStorage.removeItem(ACCESS_TOKEN);
  } catch (error) {
    console.log("Unable to log out: ", error);
  }
}
