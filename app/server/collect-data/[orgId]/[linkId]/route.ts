import { proxyPublicJson } from "@/lib/proxy-public-json";

type RouteParams = { params: Promise<{ orgId: string; linkId: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { orgId, linkId } = await params;
  return proxyPublicJson(`public/collect-data/${orgId}/${linkId}/`);
}
