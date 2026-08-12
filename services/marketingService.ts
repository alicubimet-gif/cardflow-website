import { apiRequest } from "@/lib/apiClient";

export type PublicTestimonial = {
  id: string;
  quote: string;
  author: string;
  role: string;
  rating: number;
  photo_url: string;
  sort_order: number;
};

export type PublicFAQ = {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
};

export type PublicTeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  photo_url: string;
  sort_order: number;
};

async function listFrom<T>(endpoint: string): Promise<T[]> {
  const res = await apiRequest<{ data: T[] }>(endpoint);
  return Array.isArray(res?.data) ? res.data : [];
}

export function getPublicTestimonials() {
  return listFrom<PublicTestimonial>("/server/testimonials");
}

export function getPublicFaqs() {
  return listFrom<PublicFAQ>("/server/faqs");
}

export function getPublicTeam() {
  return listFrom<PublicTeamMember>("/server/team");
}
