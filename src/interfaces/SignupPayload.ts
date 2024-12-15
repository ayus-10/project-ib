import { SigninPayload } from "./SigninPayload";

export interface SignupPayload extends SigninPayload {
  fullName: string;
  isAdmin: boolean;
}
