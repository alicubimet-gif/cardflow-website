import { proxyPublicJson } from "@/lib/proxy-public-json";

type RouteParams = { params: Promise<{ orgId: string; linkId: string }> };

export async function GET(request: Request, { params }: RouteParams) {
  const { orgId, linkId } = await params;
  const { searchParams } = new URL(request.url);
  const qs = searchParams.toString();
  return proxyPublicJson(
    `public/collect-data/${orgId}/${linkId}/schema/${qs ? `?${qs}` : ""}`,
  );
}
