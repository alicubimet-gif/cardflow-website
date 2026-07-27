"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform, useInView, animate } from "framer-motion";
import {
  CreditCard,
  Layers,
  Database,
  Printer,
  ChevronRight,
  TrendingUp,
  FileCheck2,
  Users,
  CheckCircle,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Send,
  Loader2,
  Clock,
  Star,
  Zap,
  Lock,
  Eye,
  CheckSquare,
  Gift
} from "lucide-react";
import { getPublicPricing } from "@/services/pricingService";
import { requestDemo } from "@/services/demoService";
import { useToast } from "@/components/ui/Toast";
import InteractiveCardDemo from "@/components/sections/InteractiveCardDemo";
import Button from "@/components/ui/Button";
import { PhoneInput } from "@/components/ui/PhoneInput";
import Accordion from "@/components/ui/Accordion";
import { GOOGLE_MAPS_URL } from "@/lib/config";

interface CreditPackage {
  id: string;
  package_name: string;
  credits: number;
  price: string | number;
  currency: string;
  description: string;
  is_popular: boolean;
  status: string;
}

// 1. Reusable Statistics Counter Component
interface StatCounterProps {
  value: number;
  suffix?: string;
  decimals?: number;
}

function StatCounter({ value, suffix = "", decimals = 0 }: StatCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (!inView) return;
    const node = ref.current;
    if (!node) return;

    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1], // Custom smooth ease-out
      onUpdate(val) {
        if (decimals > 0) {
          node.textContent = val.toFixed(decimals) + suffix;
        } else {
          node.textContent = Math.floor(val).toLocaleString("en-US") + suffix;
        }
      },
    });

    return () => controls.stop();
  }, [value, inView, decimals, suffix]);

  return <span ref={ref} className="font-heading font-black">0{suffix}</span>;
}

export default function Home() {
  const router = useRouter();
  const { showToast } = useToast();
  
  // Mouse position values for optimized parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for mouse parallax
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  // Map spring coordinates to visual depth layers (Parallax)
  const layer1X = useTransform(springX, [-0.5, 0.5], ["-15px", "15px"]);
  const layer1Y = useTransform(springY, [-0.5, 0.5], ["-15px", "15px"]);
  const layer2X = useTransform(springX, [-0.5, 0.5], ["-35px", "35px"]);
  const layer2Y = useTransform(springY, [-0.5, 0.5], ["-35px", "35px"]);
  const layer3X = useTransform(springX, [-0.5, 0.5], ["15px", "-15px"]);
  const layer3Y = useTransform(springY, [-0.5, 0.5], ["15px", "-15px"]);

  // 3D ID Card depth rotations on hover
  const cardRotateX = useTransform(springY, [-0.5, 0.5], [12, -12]);
  const cardRotateY = useTransform(springX, [-0.5, 0.5], [-12, 12]);

  // Form & Packages state
  const [packages, setPackages] = useState<CreditPackage[]>([]);
  const [loadingPackages, setLoadingPackages] = useState(true);
  const [packagesError, setPackagesError] = useState(false);
  const [enquiryName, setEnquiryName] = useState("");
  const [enquiryCompany, setEnquiryCompany] = useState("");
  const [enquiryEmail, setEnquiryEmail] = useState("");
  const [enquiryPhone, setEnquiryPhone] = useState("");
  const [enquiryProjectType, setEnquiryProjectType] = useState("School / College ID Cards");
  const [enquiryMessage, setEnquiryMessage] = useState("");
  const [submittingEnquiry, setSubmittingEnquiry] = useState(false);
  const [enquirySuccess, setEnquirySuccess] = useState(false);
  const [enquiryErrors, setEnquiryErrors] = useState<Record<string, string>>({});

  // Track mouse coordinates over Hero
  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;
    // Normalize coordinates to -0.5 to 0.5 range
    mouseX.set((clientX / width) - 0.5);
    mouseY.set((clientY / height) - 0.5);
  };

  // Fetch real backend packages via API client
  useEffect(() => {
    async function fetchPackages() {
      try {
        const data: any = await getPublicPricing();
        let parsed: any[] = [];
        if (Array.isArray(data)) {
          parsed = data;
        } else if (data && typeof data === "object") {
          if (Array.isArray(data.data)) {
            parsed = data.data;
          } else if (Array.isArray(data.results)) {
            parsed = data.results;
          }
        }
        const active = parsed.filter((p: any) => p.status === "active");
        active.sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0));
        setPackages(active.slice(0, 3)); // Display top 3
        setPackagesError(false);
      } catch (err: any) {
        setPackagesError(true);
      } finally {
        setLoadingPackages(false);
      }
    }
    fetchPackages();
  }, []);

  const handleCheckout = async (pkgId: string) => {
    showToast("Please create an account to purchase credit packages.", "info");
    router.push(`/register?next=/payment/checkout?package_id=${pkgId}`);
  };

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!enquiryName.trim()) {
      errors.name = "Name is required.";
    }

    if (!enquiryEmail.trim()) {
      errors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(enquiryEmail)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!enquiryPhone.trim()) {
      errors.phone = "Phone number is required.";
    } else {
      const cleanPhone = enquiryPhone.replace(/\D/g, "");
      if (cleanPhone.length !== 10) {
        errors.phone = "Please enter a valid 10-digit Indian mobile number.";
      }
    }

    if (!enquiryMessage.trim()) {
      errors.message = "Message is required.";
    }

    if (Object.keys(errors).length > 0) {
      setEnquiryErrors(errors);
      const keysOrdered = ["name", "email", "phone", "message"];
      for (const k of keysOrdered) {
        if (errors[k]) {
          const el = document.getElementById(`enquiry-${k}`);
          if (el) el.focus();
          break;
        }
      }
      return;
    }

    setEnquiryErrors({});
    setSubmittingEnquiry(true);
    showToast("Sending enquiry...", "info");
    
    // Package project type cleanly inside message to preserve backend structure
    const formattedMessage = `[Project Type: ${enquiryProjectType}] ${enquiryMessage}`;

    try {
      await requestDemo({
        name: enquiryName,
        email: enquiryEmail,
        phone: enquiryPhone,
        company: enquiryCompany,
        message: formattedMessage
      });
      setEnquirySuccess(true);
      showToast("Message sent successfully.", "success");
      setEnquiryName("");
      setEnquiryCompany("");
      setEnquiryEmail("");
      setEnquiryPhone("");
      setEnquiryProjectType("School / College ID Cards");
      setEnquiryMessage("");
      setTimeout(() => setEnquirySuccess(false), 6000);
    } catch (err: any) {
      showToast("Unable to send enquiry. Please try again later.", "error");
    } finally {
      setSubmittingEnquiry(false);
    }
  };

  // Stagger entry animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const fadeUpVariant = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const fadeScaleVariant = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  const featuresList = [
    {
      icon: Layers,
      title: "Variable Data Dynamic Templates",
      desc: "Define placeholders for user names, custom fields, dates, and automatically map Excel columns to populate them."
    },
    {
      icon: Database,
      title: "Seamless Rosters Ingestion",
      desc: "Upload CSV/Excel spreadsheets to map hundreds of records simultaneously and generate full card previews in real time."
    },
    {
      icon: FileCheck2,
      title: "Approval Workflow Supervision",
      desc: "Verify profile photo scales and review details. Trigger draft, submitted, approved, or correction requested workflows."
    },
    {
      icon: Printer,
      title: "Calibrated Print Output",
      desc: "Export print-ready files matched to your card printers: single-sheet layouts or standard CR80 ISO dimensions (85.60 × 53.98 mm)."
    }
  ];

  const steps = [
    {
      number: "01",
      title: "Design ID Templates",
      desc: "Use Z Cards Studio to create identity templates with standard placeholders for names, photos, QR codes, and barcodes.",
    },
    {
      number: "02",
      title: "Sync Databases",
      desc: "Connect your subscriber database via simple Excel/CSV uploads or API integrations to load personnel data instantly.",
    },
    {
      number: "03",
      title: "Batch Print",
      desc: "Preview, verify, and export print-ready card bundles calibrated for thermal, dye-sublimation, or inkjet card printers.",
    },
  ];

  const trustList = [
    { icon: Zap, title: "Fast Setup", desc: "No complex deployment. Upload and map visual assets in minutes." },
    { icon: Lock, title: "Secure Platform", desc: "Enterprise protection protocols keep sensitive personnel details private." },
    { icon: Printer, title: "Bulk Printing Support", desc: "Pre-arranged card layouts optimized for industrial card printer formats." },
    { icon: Users, title: "School & Employee IDs", desc: "Ready templates built for corporate office profiles and school programs." },
    { icon: Eye, title: "Live Card Preview", desc: "3D interactive alignment test on front & back visuals before exporting sheets." },
    { icon: CheckSquare, title: "Approval Workflow", desc: "Structured workflow logs from draft submission to review checks." },
    { icon: Gift, title: "Credit-Based System", desc: "No recurring fees. Top-up printing points when you actually require them." },
  ];

  const testimonials = [
    {
      quote: "Z Cards reduced our school's registration-to-card pipeline from three weeks to two days. Students uploaded their own photos, and we verified everything in minutes.",
      author: "Sarah Jenkins",
      role: "IT Director at Oakridge Academy",
      rating: 5
    },
    {
      quote: "For our print shop, this platform is a game changer. Clients upload their own rosters, and we export print-ready batch layouts. No layout errors, zero waste.",
      author: "David Chen",
      role: "Owner at PrintMax Solutions",
      rating: 5
    },
    {
      quote: "We managed employee cards for 5 office locations. The approval workflow ensured all security designs and barcodes matched our guidelines before sending to printing.",
      author: "Marcus Thorne",
      role: "HR Lead at Velo Financial",
      rating: 5
    }
  ];

  const faqs = [
    {
      question: "Which physical card printers are compatible with Z Cards?",
      answer:
        "Z Cards is compatible with all major physical ID card printers, including Evolis, Zebra, Fargo, Magicard, and Nisca. We support direct printing or exporting high-resolution, print-ready PDF batches matching standard CR80 credit-card dimensions (85.60 × 53.98 mm).",
    },
    {
      question: "Can I import employee lists directly from HR systems?",
      answer:
        "Yes! Z Cards supports importing member lists from Excel sheet files, CSV tables, and Google Sheets. Additionally, you can connect your existing database to our REST APIs to automate data ingestion.",
    },
    {
      question: "How does the registration and payment flow work?",
      answer:
        "Select a credit package that fits your business. Once registered, complete payment using Stripe's secure checkout. Your customized studio workspace is instantly initialized, allowing you to design and print immediately.",
    },
    {
      question: "Is there a limit on how many cards I can design and print?",
      answer:
        "Designing is unlimited on all accounts. Printing cards consumes 'printing credits'. Each plan comes with a generous monthly credit quota, and you can purchase extra credit packages as needed from your dashboard.",
    },
  ];

  return (
    <div className="space-y-20 md:space-y-28 lg:space-y-32 pb-24 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 overflow-x-hidden">
      
      {/* 1. HERO SECTION WITH PREMIUM BACKGROUNDS & PARALLAX */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative overflow-hidden pt-16 md:pt-28 pb-20 border-b border-slate-100 dark:border-slate-900 bg-gradient-to-b from-slate-50/50 via-white to-white dark:from-slate-950 dark:via-slate-950 dark:to-slate-950 mesh-gradient"
      >
        {/* Soft glowing mesh background orbs mapped to mouse position */}
        <motion.div 
          style={{ x: layer2X, y: layer2Y }}
          className="absolute -top-10 right-1/4 w-[450px] h-[450px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-3xl pointer-events-none -z-10" 
        />
        <motion.div 
          style={{ x: layer3X, y: layer3Y }}
          className="absolute top-1/3 left-10 w-[350px] h-[350px] rounded-full bg-teal-500/10 dark:bg-teal-500/5 blur-3xl pointer-events-none -z-10" 
        />
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none -z-10" />

        {/* Floating particle highlights */}
        <motion.div 
          animate={{ y: [0, -15, 0], x: [0, 8, 0], rotate: [0, 90, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10% w-3 h-3 rounded-full bg-blue-400/30 blur-xs pointer-events-none hidden md:block"
        />
        <motion.div 
          animate={{ y: [0, 20, 0], x: [0, -12, 0] }}
          transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-40 right-20% w-4 h-4 rounded-full bg-teal-400/20 blur-xs pointer-events-none hidden md:block"
        />
        <motion.div 
          animate={{ y: [0, -25, 0], rotate: [0, 180, 0] }}
          transition={{ duration: 11, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/2 right-5% w-2.5 h-2.5 rounded-full bg-indigo-400/40 blur-2xs pointer-events-none hidden md:block"
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Hero Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 lg:col-span-7 text-left space-y-6"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 text-blue-600 dark:text-blue-400 shadow-sm hover:scale-105 transition-transform duration-200">
              <CreditCard className="w-3.5 h-3.5" /> Next-Gen ID Card SaaS Platform
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight max-w-2xl text-slate-900 dark:text-white font-heading">
              Smart ID Card Management &{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-500 to-teal-500 dark:from-blue-400 dark:to-teal-400">
                Printing Platform
              </span>
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed font-medium">
              Z Cards helps printing agencies, schools, offices, and organizations manage ID card data, approvals, previews, printing, and credit-based production in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link href="/register" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto flex items-center justify-center gap-1.5 hover:scale-102 hover:shadow-lg hover:shadow-blue-500/20 active:scale-98 transition-all duration-200">
                  Create Account <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="w-full sm:w-auto hover:bg-slate-50 dark:hover:bg-slate-900 hover:scale-102 transition-all" onClick={() => {
                const el = document.getElementById("demo-request");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                Book Demo
              </Button>
            </div>

            {/* Micro Stats (Upgraded to Count-up Counters) */}
            <div className="pt-8 border-t border-slate-100 dark:border-slate-900 grid grid-cols-3 gap-6 text-left">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 font-heading">
                  <StatCounter value={10000} suffix="+" />
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                  Cards Designed
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white font-heading">
                  <StatCounter value={99.9} suffix="%" decimals={1} />
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                  Uptime SLA
                </p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-teal-600 dark:text-teal-400 font-heading">
                  <StatCounter value={500} suffix="+" />
                </p>
                <p className="text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider mt-1">
                  Institutions
                </p>
              </div>
            </div>
          </motion.div>

          {/* Hero Right Visual Column with Mouse-follow Parallax & 3D Tilt Card */}
          <div className="order-1 lg:order-2 lg:col-span-5 relative flex justify-center items-center mb-8 lg:mb-0">
            
            {/* Parallax moving background layer */}
            <motion.div 
              style={{ x: layer1X, y: layer1Y }}
              className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-teal-500/5 dark:from-blue-500/10 dark:to-teal-500/10 rounded-3xl -z-10 transform rotate-3 scale-105" 
            />
            
            {/* Floating Card Container with float animation */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="perspective-[1000px] z-10"
            >
              {/* Actual 3D interactive Card with tilt on mouse position */}
              <motion.div
                style={{ 
                  rotateX: cardRotateX, 
                  rotateY: cardRotateY,
                  transformStyle: "preserve-3d" 
                }}
                whileHover={{ scale: 1.03 }}
                className="relative w-72 h-108 bg-gradient-to-br from-slate-900 to-slate-950 dark:from-slate-950 dark:to-slate-900 rounded-2xl shadow-2xl p-6 border border-slate-800 dark:border-slate-800 text-white flex flex-col justify-between overflow-hidden cursor-grab active:cursor-grabbing"
              >
                {/* Background gradient glowing spots */}
                <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-blue-500/30 blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-32 h-32 rounded-full bg-teal-500/20 blur-2xl pointer-events-none" />
                
                <div style={{ transform: "translateZ(50px)" }} className="relative flex flex-col justify-between h-full z-10">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                        <CreditCard className="w-3.5 h-3.5 text-blue-400" />
                      </div>
                      <span className="font-extrabold text-[9px] uppercase tracking-widest text-slate-300">Zamirzac Cards</span>
                    </div>
                    <ShieldCheck className="w-4 h-4 text-teal-400" />
                  </div>

                  {/* Avatar */}
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full p-1 border-2 border-blue-500/50 mb-3 bg-slate-900 overflow-hidden shadow-inner transform hover:scale-105 transition-transform duration-300">
                      <img 
                        src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250" 
                        alt="Avatar Preview" 
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
                    <h3 className="font-bold text-base text-center text-white">Kathryn McKinney</h3>
                    <p className="text-[10px] text-blue-400 uppercase font-bold tracking-wider mt-1">Security Manager</p>
                  </div>

                  {/* Footer details */}
                  <div className="flex items-center justify-between border-t border-white/10 pt-3">
                    <div>
                      <span className="text-[7px] uppercase tracking-wider text-slate-400 block font-bold">Member ID</span>
                      <span className="font-mono text-[10px] font-semibold text-slate-200">Z-CF-928410</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[8px] font-bold tracking-widest uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                      APPROVED
                    </span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Floating badges */}
            <motion.div
              style={{ x: layer3X, y: layer3Y }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute top-10 -left-6 bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-3.5 hidden sm:flex items-center gap-2.5 max-w-[170px]"
            >
              <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold">Live Approved</p>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">Vector Preview ready</p>
              </div>
            </motion.div>

            <motion.div
              style={{ x: layer1X, y: layer1Y }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-12 -right-6 bg-white dark:bg-slate-900 text-slate-950 dark:text-white border border-slate-100 dark:border-slate-800 shadow-xl rounded-2xl p-3.5 hidden sm:flex items-center gap-2.5 max-w-[170px]"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-500" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold">Instant Issuance</p>
                <p className="text-[8px] text-slate-400 dark:text-slate-500 font-bold mt-0.5">RFID & Barcode ready</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. INTERACTIVE DEMO CONTAINER WITH SCROLL ZOOM IN & GLOW */}
      <section className="bg-slate-50 dark:bg-slate-900/40 py-20 border-y border-slate-100 dark:border-slate-900 relative">
        <div className="max-w-7xl mx-auto text-center px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpVariant}
            className="max-w-3xl mx-auto mb-12 text-center space-y-3"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
              Live Interactive Card Generator
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Click the card below to flip between its Front (avatar, identity detail) and Back (verified QR, print barcode, authorization signature) templates.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeScaleVariant}
            className="relative p-6 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-2xl overflow-hidden"
          >
            {/* Animated radial gradient glows */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/5 dark:bg-teal-500/2 rounded-full blur-2xl pointer-events-none" />
            
            <div className="relative z-10">
              <InteractiveCardDemo />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3. TAILORED BENEFITS SECTION & STATISTICS COUNTERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            Tailored Workflows for Every Organization
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            Whether you operate a high-volume printing factory or manage member cards for a school or corporation, Z Cards simplifies execution.
          </p>
        </motion.div>

        {/* Dynamic Statistics counters section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20 text-center"
        >
          {[
            { value: 10000, suffix: "+", label: "Cards Designed" },
            { value: 500, suffix: "+", label: "Institutions Supported" },
            { value: 1, suffix: "M+", label: "Print Records Managed" },
            { value: 99.9, suffix: "%", label: "Platform Uptime", decimals: 1 },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              variants={fadeUpVariant}
              className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 shadow-xs hover-glow"
            >
              <p className="text-3xl sm:text-5xl font-black text-blue-600 dark:text-blue-400 font-heading">
                <StatCounter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold mt-2">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Printing Agencies Box */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between group hover-glow"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-blue-500/10 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h3 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-3 flex items-center gap-2 font-heading">
                <Printer className="w-6 h-6" /> For Printing Agencies
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Supercharge layout alignment speeds. Minimize setup back-and-forth by enabling clients to manage their data upload folders in isolated, clean workspaces.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: TrendingUp,
                    title: "Scale Your Production",
                    desc: "Process thousands of printing orders simultaneously. No more manual copy-pasting into static layout files.",
                  },
                  {
                    icon: Layers,
                    title: "Shared Team Templates",
                    desc: "Create pre-approved layouts, lock fields, and share them across designers and printing technicians.",
                  },
                  {
                    icon: Database,
                    title: "Client Excel Integration",
                    desc: "Allow clients to directly upload spreadsheets containing data, mapping columns to card visual placeholders.",
                  }
                ].map((b, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30 shadow-xs">
                      <b.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{b.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link href="/contact" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 inline-flex items-center gap-1 group/link">
                Explore custom high-volume agency plans 
                <ChevronRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>

          {/* Colleges / Corporate Box */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 sm:p-10 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-md hover:shadow-xl transition-all duration-300 relative overflow-hidden flex flex-col justify-between group hover-glow"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 dark:bg-teal-500/10 rounded-bl-full group-hover:scale-110 transition-transform duration-300" />
            <div>
              <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-400 mb-3 flex items-center gap-2 font-heading">
                <Users className="w-6 h-6" /> For Schools & Offices
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed font-medium">
                Save hours of admin work. Put card management on auto-pilot. Let employees or students upload their own photos, and verify visual badges instantly.
              </p>
              <div className="space-y-6">
                {[
                  {
                    icon: Users,
                    title: "Self-Service Portals",
                    desc: "Provide students or employees secure workspace links to upload their own profile pictures and verify details.",
                  },
                  {
                    icon: FileCheck2,
                    title: "Instant PDF Previews",
                    desc: "Automatically checks aspect ratios, photo quality, and layout guidelines before sending cards to print.",
                  },
                  {
                    icon: Printer,
                    title: "Multi-Format Export",
                    desc: "Export print-ready files matched to your card printers: single PDF sheet grids or standard CR80 ISO layouts (85.60 × 53.98 mm).",
                  }
                ].map((b, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-950/50 flex items-center justify-center text-teal-600 dark:text-teal-400 border border-teal-100 dark:border-teal-900/30 shadow-xs">
                      <b.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{b.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal font-medium">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Link href="/pricing" className="text-sm font-bold text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300 inline-flex items-center gap-1 group/link">
                View institution billing details 
                <ChevronRight className="w-4 h-4 transform group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. FEATURES GRID WITH STAGGER REVEAL */}
      <section className="bg-slate-50/70 dark:bg-slate-900/30 py-20 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
              Engineered for Speed & Quality
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              Z Cards streamlines card production pipelines by automating repetitive data formatting tasks.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuresList.map((f, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                whileHover={{ y: -6, scale: 1.01 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between hover-glow"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center border border-blue-500/20 dark:border-blue-900/30 shadow-inner mb-4">
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{f.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto mb-16 space-y-4"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            Design to Print in Three Easy Steps
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
            Z Cards simplifies ID card production workflows, eliminating static template copy-paste errors completely.
          </p>
        </motion.div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
        >
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={fadeUpVariant}
              whileHover={{ y: -4 }}
              className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 relative shadow-sm group hover-glow transition-all"
            >
              <div className="absolute -top-7 left-6 font-mono font-extrabold text-6xl text-blue-600/10 dark:text-blue-400/5 group-hover:text-blue-600/20 dark:group-hover:text-blue-400/15 transition-colors select-none">
                {step.number}
              </div>
              <div className="mt-4 space-y-2">
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">{step.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* 6. TRUST SECTION ("Why Choose Zamirzac?") WITH LIFT + GLOW CARDS */}
      <section className="bg-slate-50/70 dark:bg-slate-900/20 py-20 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
              Why Choose Zamirzac?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              We provide a complete high-grade suite built specifically for visual verification and secure production workflow management.
            </p>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trustList.map((item, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpVariant}
                whileHover={{ y: -5, scale: 1.01 }}
                className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between hover-glow"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-500/20 dark:border-teal-900/30 mb-4">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">{item.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 7. PRICING SUMMARY (REAL BACKEND CREDIT PACKAGES) WITH CARD LIFT EFFECTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto space-y-4"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            Premium Credit Packages
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No monthly plans. Unlimited design workspace. Buy print credits only when you are ready to produce cards.
          </p>
        </motion.div>

        {loadingPackages ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 space-y-4 shadow-sm h-80 flex flex-col justify-between">
                <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-1/2"></div>
                <div className="h-10 bg-slate-100 dark:bg-slate-800 rounded w-full"></div>
              </div>
            ))}
          </div>
        ) : packagesError || packages.length === 0 ? (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            variants={fadeScaleVariant}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-8 max-w-md mx-auto text-center shadow-lg"
          >
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Flexible Pricing Packages</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed font-medium">
              Our database packages are dynamically synchronized. Please visit the pricing directory for secure checkout options.
            </p>
            <Link href="/pricing" className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 dark:bg-blue-950 px-3.5 py-2 rounded-xl transition-all">
              Go to Pricing <ArrowRight size={13} />
            </Link>
          </motion.div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-4 text-left"
          >
            {packages.map((pkg) => {
              const currencySymbol = pkg.currency?.toLowerCase() === 'usd' ? '$' : '₹';
              return (
                <motion.div
                  key={pkg.id}
                  variants={fadeUpVariant}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className={`relative rounded-2xl p-8 border bg-white dark:bg-slate-900 flex flex-col justify-between shadow-md transition-all duration-300 ${
                    pkg.is_popular ? "border-[#2563EB] ring-2 ring-[#2563EB]/25" : "border-slate-200 dark:border-slate-850"
                  } hover-glow`}
                >
                  {pkg.is_popular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#2563EB] text-white flex items-center gap-1 shadow-sm">
                      <Sparkles size={10} className="fill-current" /> Most Popular
                    </span>
                  )}

                  <div className="space-y-5">
                    <div className="flex items-start justify-between">
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-heading">{pkg.package_name}</h3>
                      <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 dark:border-blue-900/30">
                        Credits Pack
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium min-h-[40px]">{pkg.description}</p>
                    
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-bold text-slate-900 dark:text-white">{currencySymbol}</span>
                      <span className="text-4xl font-black text-slate-900 dark:text-white font-heading">
                        {typeof pkg.price === 'number' ? pkg.price.toLocaleString('en-IN') : parseFloat(pkg.price as string).toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase ml-1">/ one-time</span>
                    </div>

                    <div className="h-px bg-slate-100 dark:bg-slate-800" />
                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-850 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Prints Credit quota</span>
                      <span className="text-sm font-black text-blue-600 dark:text-blue-400 font-heading">{pkg.credits.toLocaleString()} Prints</span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-50 dark:border-slate-850">
                    <button
                      onClick={() => handleCheckout(pkg.id)}
                      className={`w-full justify-center py-2.5 flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider h-10 rounded-xl transition-all duration-200 cursor-pointer ${
                        pkg.is_popular 
                          ? "bg-[#2563EB] hover:bg-blue-700 text-white shadow-sm shadow-blue-500/10 hover:shadow-blue-500/20" 
                          : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      Buy Package <ArrowRight size={13} />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>

      {/* 8. TESTIMONIALS SECTION WITH SLIDE REVEAL */}
      <section className="bg-slate-50 dark:bg-slate-900/30 py-20 border-y border-slate-100 dark:border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpVariant}
            className="text-center max-w-3xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
              Loved by Teams Worldwide
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-base font-medium">
              Hear from administrative leads, card makers, and printing agencies using Z Cards.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: idx * 0.15, ease: "easeOut" }}
                whileHover={{ y: -5 }}
                className="p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col justify-between hover-glow"
              >
                <div>
                  <div className="flex items-center gap-1 mb-4 text-amber-500">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-350 italic leading-relaxed font-medium">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">{t.author}</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold mt-0.5">{t.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQS WITH ACCORDION ANIMATION */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center mb-12 space-y-3"
        >
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center justify-center gap-2 font-heading">
            <HelpCircle className="w-7 h-7 text-blue-600 dark:text-blue-400" /> Frequently Asked Questions
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Everything you need to know about the Z Cards SaaS platform and printing engine.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Accordion items={faqs} />
        </motion.div>
      </section>

      {/* 10. REDESIGNED HOME PAGE CONTACT & MAP SECTION */}
      <section id="demo-request" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="text-center max-w-3xl mx-auto space-y-3"
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl font-heading">
            Contact Our Team
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            Have questions about bulk orders, template designs, or pricing? Drop us a message below.
          </p>
        </motion.div>

        {/* Info & Form Two-Column Grid */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch max-w-6xl mx-auto"
        >
          {/* Left Side: Contact Information Cards */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Contact Details</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Reach out to us directly or fill out the form to request a custom configuration, bulk prices, or a guided tour of Z Cards Studio.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
              {/* Card 1: Address */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300 shadow-sm group">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Office Address</h4>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 leading-relaxed font-semibold transition-colors"
                  >
                    Zamirzac Solutions<br />
                    Calicut, Kerala, India
                  </a>
                  <a
                    href={GOOGLE_MAPS_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] text-blue-600 dark:text-blue-400 font-bold hover:underline mt-1"
                  >
                    <MapPin className="w-3 h-3" /> Open in Google Maps
                  </a>
                </div>
              </div>

              {/* Card 2: Phone */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300 shadow-sm group">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Phone Support</h4>
                  <p className="text-xs text-slate-750 dark:text-slate-300 font-bold mt-1">
                    <a href="tel:+18005552273" className="hover:underline">+1 (800) 555-CARD</a>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Toll-free Support</p>
                </div>
              </div>

              {/* Card 3: Email */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300 shadow-sm group">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Support Email</h4>
                  <p className="text-xs text-slate-750 dark:text-slate-300 font-bold mt-1">
                    <a href="mailto:support@zcards.in" className="hover:underline">support@zcards.in</a>
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">24/7 Response Desk</p>
                </div>
              </div>

              {/* Card 4: Hours */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 hover:-translate-y-0.5 hover:shadow-md hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-300 shadow-sm group">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="space-y-1 text-left">
                  <h4 className="font-extrabold text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider">Business Hours</h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-normal font-semibold mt-1">
                    Mon - Fri: 9:00 AM - 6:00 PM<br />
                    Weekend: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media Links */}
            <div className="pt-2 flex items-center gap-4">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Follow Us:</span>
              <div className="flex items-center gap-3">
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center text-slate-650 dark:text-slate-400 transition-all duration-300" aria-label="Twitter">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center text-slate-650 dark:text-slate-400 transition-all duration-300" aria-label="LinkedIn">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0h.003z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 flex items-center justify-center text-slate-650 dark:text-slate-400 transition-all duration-300" aria-label="Instagram">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 0.013-3.583 0.07-4.849 0.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side: Contact Form Card */}
          <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Send us a Message</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Have questions or request pricing models? Fill out the inquiry ticket below.
            </p>

            {enquirySuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-emerald-800 dark:text-emerald-300 text-sm space-y-2.5"
              >
                <div className="flex items-center gap-2 font-bold text-emerald-900 dark:text-emerald-200">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <span>Enquiry Sent Successfully!</span>
                </div>
                <p className="text-xs text-emerald-750 dark:text-emerald-400 leading-relaxed font-medium">
                  Thank you for reaching out. We have logged your request in Z Cards Control under our active support tickets. An agent will contact you shortly.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleEnquirySubmit} className="mt-8 space-y-4" noValidate>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="enquiry-name">Full Name *</label>
                    <input
                      id="enquiry-name"
                      type="text"
                      placeholder="John Doe"
                      value={enquiryName}
                      onChange={(e) => {
                        setEnquiryName(e.target.value);
                        if (enquiryErrors.name) setEnquiryErrors(prev => ({ ...prev, name: "" }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white dark:bg-slate-950 focus:outline-none transition-colors text-slate-900 dark:text-white ${
                        enquiryErrors.name ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-400 hover:border-slate-350 dark:hover:border-slate-700"
                      }`}
                    />
                    {enquiryErrors.name && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">{enquiryErrors.name}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="enquiry-subject">Subject</label>
                    <input
                      id="enquiry-subject"
                      type="text"
                      placeholder="Subject or Organization Name"
                      value={enquiryCompany}
                      onChange={(e) => setEnquiryCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-900 dark:text-white hover:border-slate-350 dark:hover:border-slate-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="enquiry-email">Email Address *</label>
                    <input
                      id="enquiry-email"
                      type="email"
                      placeholder="john@company.com"
                      value={enquiryEmail}
                      onChange={(e) => {
                        setEnquiryEmail(e.target.value);
                        if (enquiryErrors.email) setEnquiryErrors(prev => ({ ...prev, email: "" }));
                      }}
                      className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white dark:bg-slate-950 focus:outline-none transition-colors text-slate-900 dark:text-white ${
                        enquiryErrors.email ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-400 hover:border-slate-350 dark:hover:border-slate-700"
                      }`}
                    />
                    {enquiryErrors.email && (
                      <p className="text-xs text-red-500 font-medium mt-0.5">{enquiryErrors.email}</p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-1.5" htmlFor="enquiry-phone">Phone Number</label>
                    <PhoneInput
                      id="enquiry-phone"
                      value={enquiryPhone}
                      onChange={(val) => {
                        setEnquiryPhone(val);
                        setEnquiryErrors(prev => ({ ...prev, phone: "" }));
                      }}
                      error={enquiryErrors.phone}
                      placeholder="Enter phone number"
                    />
                    {enquiryErrors.phone && (
                      <p className="text-xs text-red-500 font-medium mt-1">{enquiryErrors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="enquiry-project-type">Project Type</label>
                  <select
                    id="enquiry-project-type"
                    value={enquiryProjectType}
                    onChange={(e) => setEnquiryProjectType(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-950 focus:outline-none focus:border-blue-600 dark:focus:border-blue-400 text-slate-900 dark:text-white hover:border-slate-350 dark:hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    <option value="School / College ID Cards">School / College ID Cards</option>
                    <option value="Corporate / Employee ID Cards">Corporate / Employee ID Cards</option>
                    <option value="High-Volume Printing Agency">High-Volume Printing Agency</option>
                    <option value="Custom Card Workflow">Custom Card Workflow</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400" htmlFor="enquiry-message">Your Message *</label>
                  <textarea
                    id="enquiry-message"
                    rows={4}
                    placeholder="Describe your ID card volume, template custom requirements, or billing queries..."
                    value={enquiryMessage}
                    onChange={(e) => {
                      setEnquiryMessage(e.target.value);
                      if (enquiryErrors.message) setEnquiryErrors(prev => ({ ...prev, message: "" }));
                    }}
                    className={`w-full px-3.5 py-2.5 text-sm border rounded-xl bg-white dark:bg-slate-950 focus:outline-none transition-colors text-slate-900 dark:text-white leading-relaxed ${
                      enquiryErrors.message ? "border-red-500 focus:border-red-500" : "border-slate-200 dark:border-slate-800 focus:border-blue-600 dark:focus:border-blue-400 hover:border-slate-350 dark:hover:border-slate-700"
                    }`}
                  />
                  {enquiryErrors.message && (
                    <p className="text-xs text-red-500 font-medium mt-0.5">{enquiryErrors.message}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={submittingEnquiry}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/25 active:scale-98 transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submittingEnquiry ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" /> Sending...
                      </>
                    ) : (
                      <>
                        Schedule a Free Consultation <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Full Width Google Map Section */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUpVariant}
          className="space-y-6 pt-8 border-t border-slate-100 dark:border-slate-800"
        >
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-heading">
              Visit Our Location
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              We are located at Zamirzac Solutions, Calicut, Kerala. Check the map below for directions.
            </p>
          </div>

          <div className="w-full h-[400px] overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md p-2 bg-white dark:bg-slate-950">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3913.3444857418723!2d75.9068247758369!3d11.21652285055006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64530d8c08897%3A0x847e5e20a540abea!2sZamirzac%20Solutions!5e0!3m2!1sen!2sin!4v1718173678000!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Zamirzac Office Location Map"
              className="w-full h-full rounded-2xl"
            ></iframe>
          </div>
        </motion.div>
      </section>

    </div>
  );
}
