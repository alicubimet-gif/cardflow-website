import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/lib/backend-server";
import { sanitizePublicPayload } from "@/lib/public-media";

type RouteParams = { params: Promise<{ orgId: string; linkId: string }> };

export async function POST(request: Request, { params }: RouteParams) {
  const { orgId, linkId } = await params;
  const formData = await request.formData();
  const res = await fetch(getBackendApiUrl(`public/collect-data/${orgId}/${linkId}/submit/`), {
    method: "POST",
    body: formData,
  });
  const data = await res.json().catch(() => ({ message: "Submission failed." }));
  return NextResponse.json(sanitizePublicPayload(data), { status: res.status });
}
