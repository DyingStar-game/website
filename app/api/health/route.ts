import { route } from "@lib/zod-route";
import { NextResponse } from "next/server";

export const GET = route.handler(async () => {
  return NextResponse.json({ message: "Tout va bien tkt !" }, { status: 200 });
});
