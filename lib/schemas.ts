import { z } from "zod";

const IndianPhoneSchema = z.string()
  .min(1, "Phone number is required.")
  .transform((val) => val.trim().replace(/\D/g, ""))
  .refine((val) => /^\d{10}$/.test(val), "Please enter a valid 10-digit phone number.");

export const ContactSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  phone: IndianPhoneSchema,
  subject: z.string().min(1, "Subject is required."),
  message: z.string().min(1, "Message is required."),
});

export const EnquirySchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  phone: IndianPhoneSchema,
  company: z.string().min(1, "Company name is required."),
  cardVolume: z.string().min(1, "Please select estimated card printing volume"),
  interest: z.string().min(1, "Please select your primary interest"),
  message: z.string().min(10, "Please describe your requirements in at least 10 characters"),
});

const PlainPhoneSchema = z.string()
  .min(1, "Phone number is required.")
  .transform((val) => val.trim().replace(/\D/g, ""))
  .refine((val) => /^\d{10}$/.test(val), "Phone number must contain exactly 10 digits.");

export const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().min(1, "Email is required.").email("Please enter a valid email address."),
  phone: PlainPhoneSchema,
  company: z.string().min(2, "Company name must be at least 2 characters."),
});

export type ContactInput = z.infer<typeof ContactSchema>;
export type EnquiryInput = z.infer<typeof EnquirySchema>;
export type SignupInput = z.infer<typeof SignupSchema>;

export const CompleteProfileSchema = z.object({
  company_name: z.string().min(1, "Company name is required."),
  phone: IndianPhoneSchema,
});

export type CompleteProfileInput = z.infer<typeof CompleteProfileSchema>;
