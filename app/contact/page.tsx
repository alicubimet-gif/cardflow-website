"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Phone, MapPin, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { ContactSchema, ContactInput } from "@/lib/schemas";
import { sendContactForm } from "@/services/contactService";
import { GOOGLE_MAPS_URL } from "@/lib/config";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

import { formatValidationErrors, getErrorMessage } from "@/lib/error-handler";

export default function Contact() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(ContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactInput) => {
    setSubmitError(null);
    setSubmitSuccess(null);
    try {
      const payload = {
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        message: data.message,
      };
      await sendContactForm(payload);
      setSubmitSuccess("Thank you for contacting us. We will get back to you shortly.");
      reset();
    } catch (err: any) {
      const validationErrors = formatValidationErrors(err);
      if (Object.keys(validationErrors).length > 0) {
        Object.entries(validationErrors).forEach(([field, msg]) => {
          let mappedField = field;
          if (field === "company") mappedField = "subject";
          if (field === "full_name") mappedField = "name";
          
          setError(mappedField as any, { type: "server", message: msg });
        });
      } else {
        setSubmitError(getErrorMessage(err));
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-white dark:bg-[#0B1120] min-h-screen transition-all duration-300 ease-in-out">

      {/* HEADER SECTION */}
      <section className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-5xl transition-colors duration-300 ease-in-out">
          Get in touch with Zamirzac
        </h1>
        <p className="text-base text-zinc-550 dark:text-gray-300 transition-colors duration-300 ease-in-out">
          Need technical support or have a billing query? Our support engineers are standing by.
        </p>
      </section>

      {/* TWO-COLUMN GRID: MAP (LEFT) & FORM (RIGHT) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto">

        {/* LEFT SIDE: EMBEDDED GOOGLE MAP */}
        <div className="lg:col-span-6 flex flex-col justify-between">
          <div className="w-full h-full min-h-[350px] lg:min-h-full overflow-hidden rounded-3xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-3 shadow-sm flex flex-col transition-all duration-300 ease-in-out">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.3444857418723!2d75.9068247758369!3d11.21652285055006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64530d8c08897%3A0x847e5e20a540abea!2sZamirzac%20Solutions!5e0!3m2!1sen!2sin!4v1718173678000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: "330px" }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full flex-1 rounded-2xl transition-all duration-300 ease-in-out"
            ></iframe>
            <div className="mt-3 pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-600 dark:text-gray-300 hover:text-primary font-medium transition-colors text-center sm:text-left"
              >
                Zamirzac Solutions, Calicut, Kerala, India
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Open in Google Maps
                </Button>
              </a>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: CONTACT FORM */}
        <div className="lg:col-span-6 rounded-3xl border border-zinc-200 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-8 shadow-sm text-left flex flex-col justify-between transition-all duration-300 ease-in-out">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-1 transition-colors duration-300 ease-in-out">Send us a Message</h2>
            <p className="text-xs text-zinc-500 dark:text-gray-300 mb-6 leading-relaxed transition-colors duration-300 ease-in-out">
              Have questions or request pricing models? Fill out the ticket below.
            </p>

            {submitSuccess && (
              <div className="mb-5 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-650 dark:text-green-400 flex items-start gap-3 transition-all duration-300 ease-in-out">
                <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm">Message Sent Successfully!</h4>
                  <p className="text-xs leading-normal mt-1">{submitSuccess}</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-5 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-655 dark:text-red-400 flex items-start gap-3 transition-all duration-300 ease-in-out">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-500" />
                <div>
                  <h4 className="font-bold text-sm">Submission Error</h4>
                  <p className="text-xs leading-normal mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4.5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name *"
                  placeholder="Anitha Krishnan"
                  error={errors.name?.message}
                  {...register("name")}
                  className="bg-zinc-50 dark:bg-[#111827] border-zinc-250 dark:border-gray-700 focus:bg-white dark:focus:bg-[#111827] text-zinc-900 dark:text-white dark:placeholder-gray-400 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out"
                />
                <Input
                  label="Email Address *"
                  type="email"
                  placeholder="anitha@farookschool.edu.in"
                  error={errors.email?.message}
                  {...register("email")}
                  className="bg-zinc-50 dark:bg-[#111827] border-zinc-250 dark:border-gray-700 focus:bg-white dark:focus:bg-[#111827] text-zinc-900 dark:text-white dark:placeholder-gray-400 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Phone Number *"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  error={errors.phone?.message}
                  {...register("phone", {
                    onChange: (e) => {
                      e.target.value = e.target.value.replace(/\D/g, "").slice(0, 10);
                    }
                  })}
                  className="bg-zinc-50 dark:bg-[#111827] border-zinc-250 dark:border-gray-700 focus:bg-white dark:focus:bg-[#111827] text-zinc-900 dark:text-white dark:placeholder-gray-400 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out"
                />
                <Input
                  label="Subject *"
                  placeholder="How can we help?"
                  error={errors.subject?.message}
                  {...register("subject")}
                  className="bg-zinc-50 dark:bg-[#111827] border-zinc-250 dark:border-gray-700 focus:bg-white dark:focus:bg-[#111827] text-zinc-900 dark:text-white dark:placeholder-gray-400 focus:ring-primary focus:border-primary transition-all duration-300 ease-in-out"
                />
              </div>

              <div className="text-left font-sans transition-all duration-300 ease-in-out">
                <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-gray-300 mb-1.5 transition-colors duration-300 ease-in-out">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what you need help with..."
                  className={`w-full px-3.5 py-2.5 text-sm rounded-lg border bg-zinc-50 dark:bg-[#111827] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder-gray-400 focus:bg-white dark:focus:bg-[#111827] focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 ease-in-out ${errors.message
                    ? "border-red-500 focus:ring-red-500/20 focus:border-red-500 dark:border-red-500"
                    : "border-zinc-250 dark:border-gray-700 focus:ring-primary/20 focus:border-primary dark:focus:border-primary"
                    }`}
                  {...register("message")}
                />
                {errors.message?.message && (
                  <p className="mt-1 text-[13px] text-red-500 font-medium">
                    {errors.message.message}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button type="submit" isLoading={isSubmitting} className="w-full sm:w-auto px-8 transition-all active:scale-95 duration-300 ease-in-out hover:bg-blue-600 dark:hover:bg-blue-500">
                  Submit Message
                </Button>
              </div>
            </form>
          </div>
        </div>

      </section>

      {/* CONTACT INFORMATION CARDS */}
      <section className="max-w-6xl mx-auto space-y-8 pt-8 border-t border-zinc-100 dark:border-gray-800 transition-all duration-300 ease-in-out">
        <div className="text-center max-w-xl mx-auto space-y-2 transition-all duration-300 ease-in-out">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white transition-colors duration-300 ease-in-out">Contact Details</h2>
          <p className="text-sm text-zinc-500 dark:text-gray-300 transition-colors duration-300 ease-in-out">
            Reach out to us directly or drop by our office.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Address */}
          <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-gray-500 transition-all duration-300 ease-in-out shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-in-out shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div className="space-y-2 transition-colors duration-300 ease-in-out">
              <h4 className="font-extrabold text-xs text-zinc-800 dark:text-white uppercase tracking-wider transition-colors duration-300 ease-in-out">Office Address</h4>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-xs text-zinc-500 dark:text-gray-300 hover:text-primary dark:hover:text-primary leading-relaxed font-medium transition-colors"
              >
                Zamirzac Solutions<br />
                Calicut, Kerala, India
              </a>
              <a
                href={GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm" className="gap-1.5 text-xs font-bold">
                  <MapPin className="w-3.5 h-3.5 text-primary" /> Open in Google Maps
                </Button>
              </a>
            </div>
          </div>

          {/* Card 2: Phone */}
          <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-gray-500 transition-all duration-300 ease-in-out shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-in-out shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div className="space-y-1 transition-colors duration-300 ease-in-out">
              <h4 className="font-extrabold text-xs text-zinc-800 dark:text-white uppercase tracking-wider transition-colors duration-300 ease-in-out">Phone Support</h4>
              <p className="text-xs text-zinc-550 dark:text-gray-300 font-bold mt-1 transition-colors duration-300 ease-in-out">
                <a href="tel:+918891633035" className="hover:underline">+91 88916 33035</a>
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-gray-500 font-medium transition-colors duration-300 ease-in-out">Toll-free Support</p>
            </div>
          </div>

          {/* Card 3: Email */}
          <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-gray-500 transition-all duration-300 ease-in-out shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-in-out shrink-0">
              <Mail className="w-6 h-6" />
            </div>
            <div className="space-y-1 transition-colors duration-300 ease-in-out">
              <h4 className="font-extrabold text-xs text-zinc-800 dark:text-white uppercase tracking-wider transition-colors duration-300 ease-in-out">Support Email</h4>
              <p className="text-xs text-zinc-550 dark:text-gray-300 font-bold mt-1 transition-colors duration-300 ease-in-out">
                <a href="mailto:support@zcards.in" className="hover:underline">support@zcards.in</a>
              </p>
              <p className="text-[10px] text-zinc-400 dark:text-gray-500 font-medium transition-colors duration-300 ease-in-out">24/7 Response Desk</p>
            </div>
          </div>

          {/* Card 4: Hours */}
          <div className="bg-white dark:bg-[#1F2937] border border-zinc-200 dark:border-gray-700 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:-translate-y-1 hover:shadow-md hover:border-zinc-300/60 dark:hover:border-gray-500 transition-all duration-300 ease-in-out shadow-sm group">
            <div className="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 text-primary dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 ease-in-out shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div className="space-y-1 transition-colors duration-300 ease-in-out">
              <h4 className="font-extrabold text-xs text-zinc-800 dark:text-white uppercase tracking-wider transition-colors duration-300 ease-in-out">Business Hours</h4>
              <p className="text-xs text-zinc-500 dark:text-gray-300 leading-normal font-medium mt-1 transition-colors duration-300 ease-in-out">
                Mon - Fri: 9 AM - 6 PM<br />
                Weekend: Closed
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
