import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/lib/backend-server";
import { sanitizePublicPayload } from "@/lib/public-media";

export async function proxyPublicJson(
  backendPath: string,
  init?: RequestInit,
): Promise<NextResponse> {
  const res = await fetch(getBackendApiUrl(backendPath), {
    cache: "no-store",
    ...init,
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(sanitizePublicPayload(data), { status: res.status });
}
