import { apiRequest } from "@/lib/apiClient";

export type PublicProduct = {
  id: string;
  category_id: string | null;
  category: string | null;
  name: string;
  slug: string;
  sku: string;
  description: string;
  images: Array<string | { id?: string; url?: string; name?: string }>;
  base_price: string;
  gst_rate: number;
  moq: number;
  unit: string;
  is_active: boolean;
  tags: string[];
  specs: Record<string, string> | Array<{ label?: string; value?: string }>;
  sort_order: number;
  stock_status: string;
  featured?: boolean;
  variants?: Array<{
    id: string;
    name: string;
    sku: string;
    price: string;
    stock_status: string;
  }>;
};

export async function getPublicProducts(opts?: {
  limit?: number;
  featured?: boolean;
  category?: string;
}): Promise<PublicProduct[]> {
  const params = new URLSearchParams();
  if (opts?.limit) params.set("limit", String(opts.limit));
  if (opts?.featured) params.set("featured", "1");
  if (opts?.category) params.set("category", opts.category);
  const qs = params.toString();
  const res = await apiRequest<{ data: PublicProduct[] }>(
    `/server/products${qs ? `?${qs}` : ""}`,
  );
  return Array.isArray(res?.data) ? res.data : [];
}

export async function getPublicProduct(id: string): Promise<PublicProduct> {
  const res = await apiRequest<{ data: PublicProduct }>(`/server/products/${id}`);
  if (!res?.data) throw new Error("Product not found.");
  return res.data;
}

export function productImageUrl(product: PublicProduct): string | null {
  const backend = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");
  for (const img of product.images || []) {
    if (typeof img === "string" && img) return img;
    if (img && typeof img === "object") {
      const id = typeof img.id === "string" ? img.id : null;
      if (id && backend) {
        return `${backend}/api/v1/storage/files/${id}/content/`;
      }
      if (img.url) return img.url;
    }
  }
  return null;
}

export function formatInr(amount: number | string) {
  const n = typeof amount === "string" ? Number(amount) : amount;
  return `₹${(Number.isFinite(n) ? n : 0).toLocaleString("en-IN")}`;
}

export function stockLabel(status?: string) {
  switch (status) {
    case "out":
      return "Out of stock";
    case "low":
      return "Low stock";
    case "made_to_order":
      return "Made to order";
    default:
      return "In stock";
  }
}

export function productSpecs(
  specs: PublicProduct["specs"],
): Array<{ label: string; value: string }> {
  if (Array.isArray(specs)) {
    return specs
      .map((s) => ({ label: String(s.label || ""), value: String(s.value || "") }))
      .filter((s) => s.label || s.value);
  }
  return Object.entries(specs || {}).map(([label, value]) => ({
    label,
    value: String(value),
  }));
}
