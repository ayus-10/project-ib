"use client";

import UserForm from "@/components/UserForm";
import { ACCESS_TOKEN, SIGNUP } from "@/constants";
import { AuthResponse } from "@/interfaces/AuthResponse";
import { SignupPayload } from "@/interfaces/SignupPayload";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signup() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  async function handleSignup(payload: SignupPayload) {
    try {
      const res = await axios.post<AuthResponse>("/api/user", payload);
      localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      dispatch(setSuccessMessage("Signed up successfully."));
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error?.response?.data.error));
      }
      console.log(error);
    }
  }

  return <UserForm formType={SIGNUP} handleSignup={handleSignup} />;
}
