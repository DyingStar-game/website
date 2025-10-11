import type { ServerToastEnum } from "@feat/serverSonner/serverToast.schema";
import { cookies } from "next/headers";

export const serverToast = async (
  message: string,
  type: ServerToastEnum = "info",
) => {
  const cookieStore = await cookies();
  const id = crypto.randomUUID();
  cookieStore.set(`toast-${id}`, JSON.stringify({ message, type }), {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
  });
};
