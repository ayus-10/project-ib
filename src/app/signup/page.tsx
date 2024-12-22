"use client";

import UserForm from "@/components/UserForm";
import { ACCESS_TOKEN, SIGNUP } from "@/constants";
import { AuthResponse } from "@/interfaces/AuthResponse";
import { SignupPayload } from "@/interfaces/SignupPayload";
import { useAppDispatch } from "@/redux/hooks";
import { setErrorMessage, setSuccessMessage } from "@/redux/slices/alertSlice";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Signup() {
  const dispatch = useAppDispatch();

  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleSignup(payload: SignupPayload) {
    try {
      setLoading(true);
      const res = await axios.post<AuthResponse>("/api/user", payload);
      localStorage.setItem(ACCESS_TOKEN, res.data.accessToken);
      dispatch(setSuccessMessage("Signed up successfully."));
      router.push("/");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        dispatch(setErrorMessage(error?.response?.data.error));
      }
      console.log("Unable to sign up: ", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <UserForm
      formType={SIGNUP}
      handleSignup={handleSignup}
      isLoading={loading}
    />
  );
}
