"use client";

import UserForm from "@/components/UserForm";
import { ACCESS_TOKEN, SIGNIN } from "@/constants";
import { AuthResponse } from "@/interfaces/AuthResponse";
import { SigninPayload } from "@/interfaces/SigninPayload";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Signin() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  async function handleSignin(payload: SigninPayload) {
    try {
      const res = await axios.post<AuthResponse>("/api/auth", payload);
      localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      dispatch(setSuccessMessage("Signed in successfully."));
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error?.response?.data.error));
      }
      console.log(error);
    }
  }

  return <UserForm formType={SIGNIN} handleSignin={handleSignin} />;
}
