import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/serverProxy";

export async function GET(req: NextRequest) {
  return proxyRequest(req, "/api/auth/profile/");
}
