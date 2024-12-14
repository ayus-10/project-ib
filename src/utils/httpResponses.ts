import { NextResponse } from "next/server";

export function BadRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 });
}

export function Unauthorized(error: string) {
  return NextResponse.json({ error }, { status: 401 });
}

export function InternalServerError(err: any) {
  console.log(err);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}

export function Created(data: string | any) {
  const payload = typeof data === "string" ? { message: data } : data;
  return NextResponse.json(payload, { status: 201 });
}

export function Ok(data: string | any) {
  const payload = typeof data === "string" ? { message: data } : data;
  return NextResponse.json(payload, { status: 200 });
}
