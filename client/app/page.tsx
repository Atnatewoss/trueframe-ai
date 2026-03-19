"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Check, 
  Plus, 
  Minus,
  ExternalLink,
  Twitter,
  Github,
  Linkedin,
  ArrowUp
} from "lucide-react";

// --- Components ---

const LogoStrip = () => {
  const logos = ["META", "OPENAI", "ADOBE", "NVIDIA", "MICROSOFT", "GOOGLE"];
  return (
    <div className="w-full py-20 overflow-hidden">
      <div className="max-w-xs mx-auto px-6 mb-8">
        <p className="text-center text-[8px] font-bold uppercase tracking-[0.4em] text-foreground/20">
          Trusted by global security teams
        </p>
      </div>
      <div className="max-w-xl mx-auto flex whitespace-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_60px,_black_calc(100%-60px),transparent_100%)]">
        <div className="flex items-center gap-12 animate-scroll px-8 opacity-20 grayscale contrast-125">
          {[...logos, ...logos, ...logos, ...logos].map((logo, i) => (
            <span key={i} className="text-[12px] md:text-[14px] font-black tracking-tighter italic shrink-0">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-8 py-6 bg-black/20 backdrop-blur-xl border-b border-white/[0.02]">
    <div className="flex items-center gap-12">
      <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/50">
        <a 
          href="#features" 
          onClick={(e) => {
            e.preventDefault();
            document.querySelector('#features')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="hover:text-white transition-colors cursor-pointer"
        >
          Features
        </a>
      </div>
      
      <Link href="/" className="flex items-center gap-2 text-[14px] font-bold tracking-[0.3em] uppercase italic opacity-60 px-4">
        TrueFrame
      </Link>

      <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/50">
        <a 
          href="https://github.com/Atnatewoss/trueframe-ai" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="hover:text-white transition-colors flex items-center gap-2"
        >
          Contact
        </a>
      </div>
    </div>
  </nav>
);

const SectionHeader = ({ title, subtitle, label }: { title: string; subtitle: string; label?: string }) => (
  <div className="text-center mb-16 space-y-3">
    {label && (
      <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-blue-500/60">
        {label}
      </span>
    )}
    <h2 className="text-[30px] font-bold tracking-tight text-white leading-tight">{title}</h2>
    <p className="text-foreground/40 max-w-lg mx-auto text-[14px] font-medium leading-relaxed">{subtitle}</p>
  </div>
);

const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/[0.03] last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between text-left group"
      >
        <span className="text-[16px] font-bold text-foreground/60 group-hover:text-white transition-colors">{question}</span>
        {isOpen ? <Minus className="w-4 h-4 opacity-20" /> : <Plus className="w-4 h-4 opacity-20" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-foreground/30 text-[14px] leading-relaxed max-w-lg font-medium">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) setIsVisible(true);
      else setIsVisible(false);
    };
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 z-[60] w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:bg-neutral-200 transition-colors group cursor-pointer"
        >
          <ArrowUp className="w-5 h-5 group-hover:-translate-y-1 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

// --- Page ---

export default function LandingPage() {
  return (
    <div className="min-h-screen Selection:bg-blue-500/30 selection:text-white bg-black text-white font-sans antialiased">
      <Navbar />

      {/* Hero Section - Centered & High Conversion */}
      <section className="relative pt-40 pb-12 md:pt-56 md:pb-24 px-6 overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-screen bg-blue-600/[0.03] blur-[160px] rounded-full -z-10" />
        
        <div className="max-w-5xl mx-auto text-center z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-[32px] md:text-[40px] font-bold tracking-tight mb-6 leading-tight text-white">
              Verify video authenticity in seconds.
            </h1>
            
            <p className="text-[14px] text-foreground/40 mb-10 max-w-lg mx-auto leading-relaxed font-medium">
              TrueFrame is the definitive platform for detecting deepfakes and AI-generated media. 
              Build trust with forensic-grade evidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
              <Link href="/demo">
                <button className="w-full sm:w-auto px-8 py-3.5 bg-white text-black font-bold rounded-xl hover:bg-neutral-200 hover:scale-[1.02] transition-all text-[14px] shadow-lg cursor-pointer">
                  Analyze Video
                </button>
              </Link>
              <p className="text-[14px] text-foreground/30 font-medium">No credit card required</p>
            </div>

            {/* Large Front & Center Demo: Mike Tyson Comparison */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-5xl mx-auto group"
            >
              <div className="glass-card aspect-[16/9] rounded-[48px] p-4 border-white/[0.05] shadow-2xl overflow-hidden bg-white/[0.01]">
                <div className="bg-black w-full h-full rounded-[36px] overflow-hidden flex flex-col relative group">
                  {/* Image Split Preview */}
                  <div className="absolute inset-0 flex">
                    <div className="relative flex-1 border-r border-white/5 overflow-hidden">
                       <div className="absolute top-8 left-8 z-10 px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-xl text-[10px] font-bold text-white/60 uppercase tracking-widest border border-white/5">
                          Real
                       </div>
                       <div className="w-full h-full bg-[url('/tyson-comparison.png')] bg-cover bg-[center_left] opacity-40 group-hover:scale-105 transition-transform duration-[3s]" />
                    </div>
                    <div className="relative flex-1 overflow-hidden">
                       <div className="absolute top-8 right-8 z-10 px-4 py-1.5 bg-red-500/20 backdrop-blur-md rounded-xl text-[10px] font-bold text-red-500 uppercase tracking-widest border border-red-500/20">
                          Fake
                       </div>
                       <div className="w-full h-full bg-[url('/tyson-comparison.png')] bg-cover bg-[center_right] grayscale contrast-125 opacity-70 group-hover:scale-105 transition-transform duration-[3s]" />
                       
                       {/* Tampering Indicators */}
                       <div className="absolute inset-0 z-10 pointer-events-none">
                          <motion.div 
                            animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.05, 1] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute top-1/4 left-1/4 w-32 h-32 border-2 border-red-500/40 rounded-full shadow-[0_0_60px_rgba(239,68,68,0.2)]" 
                          />
                          <div className="absolute bottom-12 right-12 z-10 px-6 py-3 bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl shadow-2xl">
                             <p className="text-xs font-bold text-red-500 uppercase tracking-[0.2em] animate-pulse">Synthetic Detected</p>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 
      <div id="partners">
         <LogoStrip />
      </div>
      */}

      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto border-y border-white/[0.05] bg-white/[0.002]">
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.05]">
            {[
              { title: "Forensic Analysis", desc: "Detecting the undetectable. Our neural network identifies microscopic temporal artifacts that distinguish authentic media from high-fidelity synthetics." },
              { title: "Real-time Verification", desc: "Optimized for extreme performance. Get forensic results in milliseconds through our globally distributed inference network." },
              { title: "Institutional Trust", desc: "Built on hardened, high-uptime infrastructure designed for journalists, researchers, and government agencies." }
            ].map((feature, i) => (
              <div key={i} className="group p-12 space-y-6 hover:bg-white/[0.01] transition-colors">
                <h3 className="text-[20px] font-bold tracking-tight text-white leading-tight">
                  {feature.title}
                </h3>
                <p className="text-[14px] leading-relaxed text-foreground/40 font-medium max-w-xs">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ScrollToTop />

      {/* FAQ Section (Optimized Hierarchy) */}
      {/* 
      <section id="faq" className="py-40 px-6">
        <div className="max-w-4xl mx-auto">
          <SectionHeader 
             title="Frequently Asked Questions"
             subtitle="Everything you need to know about the TrueFrame infrastructure."
          />
          <div className="mt-12">
            <FAQItem 
              question="How accurate is the TrueFrame detection engine?"
              answer="TrueFrame achieves a validated accuracy of 82% on global benchmarks like FaceForensics++. Our models are continuously updated to detect the latest generative AI techniques, ensuring your verification stays current with the state-of-the-art."
            />
            <FAQItem 
              question="What video formats are supported?"
              answer="TrueFrame supports all major video formats including MP4, MOV, and AVI. Our API automatically handles transcoding to ensure optimal analysis performance regardless of the input source."
            />
            <FAQItem 
              question="How do you ensure data privacy?"
              answer="Privacy is built into our core. All video processing happens in memory and is discarded immediately after analysis. We never store raw video data, and analysis results are only saved to your private encrypted dashboard."
            />
            <FAQItem 
              question="Can I integrate TrueFrame into my own application?"
              answer="Yes, we provide a robust REST API designed for developers. Professional and Institutional users can access documentation to integrate verification directly into their content upload or moderation flows."
            />
          </div>
        </div>
      </section>
      */}

      {/* Footer (Minimalist) */}
      <footer className="py-12 px-8 border-t border-white/[0.02]">
        <div className="max-w-4xl mx-auto text-center flex items-center justify-center gap-4">
          <p className="text-[10px] text-foreground/20 font-bold tracking-widest uppercase">
            © 2026 TrueFrame. Built for Authenticity.
          </p>
          <a 
            href="https://github.com/Atnatewoss/trueframe-ai" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-[10px] text-foreground/20 font-bold tracking-widest uppercase hover:text-white transition-colors"
          >
            Contribute
          </a>
        </div>
      </footer>
    </div>
  );
}
