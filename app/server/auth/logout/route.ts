import { NextRequest } from "next/server";
import { proxyRequest } from "@/lib/serverProxy";

export async function POST(req: NextRequest) {
  return proxyRequest(req, "/api/auth/logout/");
}
