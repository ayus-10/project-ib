import { JwtPayload } from "jsonwebtoken";

export interface MyJwtPayload extends JwtPayload {
  id: number;
  email: string;
  role: "ADMIN" | "USER";
}
