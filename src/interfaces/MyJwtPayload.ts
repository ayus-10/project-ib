import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  email: string;
  role: "ADMIN" | "USER";
}
