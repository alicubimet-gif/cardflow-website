import { NextResponse } from "next/server";

import { getBackendApiUrl } from "@/lib/backend-server";

type RouteParams = { params: Promise<{ id: string }> };

/**
 * Same-origin proxy for public media (org logos, product images, etc.).
 * Browsers never need the Django API origin.
 */
export async function GET(_request: Request, { params }: RouteParams) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ detail: "Invalid file id." }, { status: 400 });
  }

  try {
    const res = await fetch(getBackendApiUrl(`v1/storage/files/${id}/content/`), {
      cache: "no-store",
    });
    if (!res.ok) {
      return new NextResponse(null, { status: res.status });
    }
    const body = await res.arrayBuffer();
    return new NextResponse(body, {
      status: 200,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ detail: "Media unavailable." }, { status: 502 });
  }
}
