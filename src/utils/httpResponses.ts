import { NextResponse } from "next/server";

export function BadRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function Unauthorized(error: string) {
  return NextResponse.json({ error }, { status: 401 });
}

export function NotFound(error: string) {
  return NextResponse.json({ error }, { status: 404 });
}

export function InternalServerError(err: unknown) {
  console.log("Internal server error: ", err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function Created(data: string | unknown) {
  const payload = typeof data === "string" ? { message: data } : data;
  return NextResponse.json(payload, { status: 201 });
}

export function Ok(data: string | unknown) {
  const payload = typeof data === "string" ? { message: data } : data;
  return NextResponse.json(payload, { status: 200 });
}
