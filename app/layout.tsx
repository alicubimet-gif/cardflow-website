import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FloatingActions from "@/components/ui/FloatingActions";
import { BrandingProvider } from "@/components/branding-provider";
import { ToastProvider } from "@/components/ui/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Z Cards | ID Card Management & Printing SaaS",
    template: "%s | Z Cards",
  },
  description:
    "Design, manage databases, and print high-quality physical ID cards in bulk with Z Cards. Custom workflows for colleges, schools, corporate houses, and print shops.",
  keywords: [
    "Z Cards",
    "ID Card Designer",
    "Bulk Card Printing",
    "SaaS ID Card",
    "ID Management System",
    "Card Printing Agency Software",
  ],
  authors: [{ name: "Z Cards Team" }],
  openGraph: {
    title: "Z Cards | ID Card Management & Printing SaaS",
    description:
      "Design, manage databases, and print high-quality physical ID cards in bulk with Z Cards.",
    siteName: "Z Cards",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Z Cards | ID Card Management & Printing SaaS",
    description:
      "Design, manage databases, and print high-quality physical ID cards in bulk with Z Cards.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var d = document.documentElement;
                  var c = localStorage.getItem('theme');
                  if (c === 'dark' || (!c && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    d.classList.add('dark');
                  } else {
                    d.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-300">
        <BrandingProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1 flex flex-col pt-20">{children}</main>
            <Footer />
            <FloatingActions />
          </ToastProvider>
        </BrandingProvider>
      </body>
    </html>
  );
}
