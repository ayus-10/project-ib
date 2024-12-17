import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { setAuthenticatedUser } from "../redux/slices/authenticatedUserSlice";
import refreshTokens from "../requests/refreshTokens";
import getAuthenticatedUser from "@/requests/getAuthenticatedUser";
import axios from "axios";

export default function useAuthentication() {
  const dispatch = useAppDispatch();

  const setStates = (email?: string, fullName?: string, role?: string) =>
    dispatch(
      setAuthenticatedUser({
        email: email ?? null,
        fullName: fullName ?? null,
        role: role ?? null,
      })
    );

  useEffect(() => {
    async function authenticateUser() {
      try {
        const res = await getAuthenticatedUser();
        setStates(res.data.email, res.data.fullName, res.data.role);
      } catch (error) {
        try {
          if (!axios.isAxiosError(error)) {
            throw new Error("Not an axios error.");
          }

          await refreshTokens();

          const newRes = await getAuthenticatedUser();
          setStates(newRes.data.email, newRes.data.fullName, newRes.data.role);
        } catch (newError) {
          setStates();
          console.log("Unable to authenticate user: ", newError);
        }
      }
    }

    authenticateUser();
  }, []);
}
