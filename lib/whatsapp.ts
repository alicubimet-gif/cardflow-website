export const WHATSAPP_SALES_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_SALES_NUMBER || "918891633035";

export function buildProductWhatsAppMessage(input: {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}) {
  return [
    "Hello,",
    "I would like to place an order from the Z Cards website.",
    "",
    `Product: ${input.name}`,
    `Quantity: ${input.quantity} ${input.unit}`,
    `Unit price: ₹${input.unitPrice.toLocaleString("en-IN")}`,
    `Estimated total: ₹${input.total.toLocaleString("en-IN")}`,
  ].join("\n");
}

export function productWhatsAppUrl(input: {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  total: number;
}) {
  const text = buildProductWhatsAppMessage(input);
  return `https://wa.me/${WHATSAPP_SALES_NUMBER}?text=${encodeURIComponent(text)}`;
}
