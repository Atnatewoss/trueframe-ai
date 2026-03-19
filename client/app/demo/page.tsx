"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  FileVideo, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ChevronLeft,
  Shield,
  Activity,
  Layers,
  Cpu
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AnalysisStep = "idle" | "uploading" | "extracting" | "analyzing" | "aggregating" | "result";

interface PredictionResult {
  prediction: "real" | "fake";
  confidence_info: string;
  frames_checked: number;
  filename: string;
}

const Navbar = () => (
  <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center px-8 py-6 bg-black/20 backdrop-blur-xl border-b border-white/[0.02]">
    <div className="flex items-center gap-12">
      <div className="hidden md:flex items-center gap-8 text-[13px] font-medium text-white/50">
        <Link href="/#features" className="hover:text-white transition-colors cursor-pointer">
          Features
        </Link>
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

const SectionHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-left mb-12 space-y-3">
    <h2 className="text-[32px] font-bold tracking-tight text-white leading-tight">{title}</h2>
    <p className="text-foreground/40 max-w-lg text-[14px] font-medium leading-relaxed">{subtitle}</p>
  </div>
);

export default function DemoPage() {
  const [step, setStep] = useState<AnalysisStep>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith("video/")) {
        setFile(selectedFile);
        setVideoPreview(URL.createObjectURL(selectedFile));
        setError(null);
      } else {
        setError("Please upload a valid video file (mp4, mov, avi).");
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("video/")) {
      setFile(droppedFile);
      setVideoPreview(URL.createObjectURL(droppedFile));
      setError(null);
    }
  };

  const reset = () => {
    setStep("idle");
    setFile(null);
    setVideoPreview(null);
    setResult(null);
    setError(null);
  };

  const runAnalysis = async () => {
    if (!file) return;

    setStep("uploading");
    
    // Simulate pipeline steps for UI feel
    const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
    
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Start the real request
      const requestPromise = fetch("http://localhost:8000/predict", {
        method: "POST",
        body: formData,
      });

      // Show UI progress steps
      await delay(1200);
      setStep("extracting");
      await delay(1500);
      setStep("analyzing");
      await delay(1800);
      setStep("aggregating");
      
      const response = await requestPromise;
      if (!response.ok) throw new Error("Analysis failed on the server.");
      
      const data = await response.json();
      setResult(data);
      await delay(800);
      setStep("result");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
      setStep("idle");
    }
  };

  const steps = [
    { id: "uploading", label: "Uploading video...", icon: <Upload className="w-4 h-4" /> },
    { id: "extracting", label: "Extracting frames...", icon: <Layers className="w-4 h-4" /> },
    { id: "analyzing", label: "CNN Deep analysis...", icon: <Cpu className="w-4 h-4" /> },
    { id: "aggregating", label: "Majority vote aggregation...", icon: <Activity className="w-4 h-4" /> },
  ];

  const handleExport = () => {
    if (!result) return;
    const reportStr = `TRUEFRAME AI - Forensic Telemetry Report\n\n` +
      `Prediction: ${result.prediction.toUpperCase()}\n` +
      `Confidence: ${result.confidence_info}\n` +
      `Frames Scanned: ${result.frames_checked}\n` +
      `Timestamp: ${new Date().toISOString()}`;
    const blob = new Blob([reportStr], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "trueframe_analysis_report.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen bg-black text-white font-sans antialiased selection:bg-emerald-500/30 selection:text-white overflow-hidden flex flex-col">
      <Navbar />

      <main className="flex-1 pt-32 pb-12 px-6 max-w-7xl mx-auto w-full flex flex-col justify-center scale-90 origin-top">
        <div className="w-full bg-[#0a0a0a] border border-white/10 rounded-none overflow-hidden flex flex-col lg:flex-row shadow-2xl relative">
          
          {/* Left Column: Interaction & Video (Input) */}
          <div className="w-full lg:w-1/2 p-10 lg:p-14 space-y-12 bg-[#050505] relative z-10">
            <SectionHeader 
              title="Deepfake Detection Analysis"
              subtitle="An AI pipeline that uses a Convolutional Neural Network (CNN) to scan video frames for synthetic manipulation."
            />

            <div className="w-full">
              <AnimatePresence mode="wait">
                {step === "idle" ? (
                  <motion.div
                    key="dropzone"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "relative group cursor-pointer aspect-video rounded-none border border-dashed transition-all flex flex-col items-center justify-center p-12 text-center overflow-hidden",
                      error ? "border-red-500/30 bg-red-500/5" : "border-white/20 hover:border-white/40 bg-white/[0.02] hover:bg-white/[0.04]"
                    )}
                  >
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept="video/*"
                    />
                    
                    {file ? (
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 rounded-none bg-emerald-500/20 text-emerald-400 group-hover:scale-110 transition-transform">
                          <FileVideo className="w-10 h-10" />
                        </div>
                        <div>
                          <p className="font-semibold text-lg truncate max-w-[200px] text-white">{file.name}</p>
                          <p className="text-sm text-white/40">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); runAnalysis(); }}
                          className="mt-6 px-10 py-3 bg-white text-black font-semibold rounded-none hover:bg-neutral-200 hover:scale-[1.02] transition-all text-[14px]"
                        >
                          Verify Authenticity
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 rounded-none bg-white/5 text-white/40 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-all">
                          <Upload className="w-10 h-10" />
                        </div>
                        <div className="mt-4">
                          <p className="font-medium text-lg text-white/80">Upload Video File</p>
                          <p className="text-sm text-white/40 mt-1">Drag and drop a video to scan</p>
                        </div>
                      </>
                    )}

                    {error && (
                      <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 flex items-center gap-2 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <p>{error}</p>
                      </div>
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="aspect-video rounded-none overflow-hidden relative group border border-white/10 bg-black"
                  >
                    {step !== "result" && (
                      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md px-8 text-center">
                        <div className="w-full max-w-sm space-y-6">
                          {steps.map((s, i) => (
                            <div key={s.id} className="relative flex items-center gap-4">
                              <div className={cn(
                                "w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-all duration-500",
                                s.id === step ? "bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : 
                                (steps.findIndex(x => x.id === step) > i ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white/[0.03] border-white/10 text-white/20")
                              )}>
                                {steps.findIndex(x => x.id === step) > i ? <CheckCircle2 className="w-3 h-3" /> : React.cloneElement(s.icon as any, {className: "w-3 h-3"})}
                              </div>
                              <p className={cn(
                                "text-[13px] font-medium transition-colors duration-500",
                                s.id === step ? "text-white" : "text-white/40"
                              )}>
                                {s.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {videoPreview && (
                       <video 
                        src={videoPreview} 
                        className={cn(
                          "w-full h-full object-cover transition-opacity duration-1000",
                          step === "analyzing" || step === "aggregating" ? "grayscale opacity-30" : 
                          step === "result" ? "opacity-100" : "opacity-80"
                        )} 
                        controls={step === "result"}
                      />
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="pt-6 flex items-center justify-between border-t border-white/10">
              <div className="flex items-center gap-6 text-[11px] font-bold uppercase tracking-wider text-white/30">
                <span className="flex items-center gap-2"><Shield className="w-4 h-4" /> Secure Processing</span>
                <span className="flex items-center gap-2"><Activity className="w-4 h-4" /> Real-time Analysis</span>
              </div>
              {step === "result" && (
                <button 
                  onClick={reset}
                  className="px-6 py-2 bg-white text-black text-[12px] font-bold uppercase tracking-wider rounded-none hover:bg-neutral-200 transition-all cursor-pointer"
                >
                  Start New Analysis
                </button>
              )}
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="hidden lg:block w-px bg-gradient-to-b from-transparent via-white/10 to-transparent relative z-20" />
          <div className="block lg:hidden h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent relative z-20" />

          {/* Right Column: Results & Telemetry (Output) */}
          <div className="w-full lg:w-1/2 p-10 lg:p-14 min-h-[500px] flex flex-col justify-center relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.02] to-emerald-500/[0.02] pointer-events-none" />
            <AnimatePresence mode="wait">
              {step === "result" && result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-10 flex flex-col justify-center h-full"
                >
                  <div className="flex flex-col gap-2">
                      <h3 className="text-3xl font-bold tracking-tight text-white mb-1">
                        {result.prediction === "fake" ? "Synthetic Detected" : "Authenticity Verified"}
                      </h3>
                      <p className="text-foreground/40 text-sm font-medium">
                        {result.prediction === "fake" ? "Temporal and spatial anomalies found." : "No synthetic manipulation detected across frames."}
                      </p>
                    </div>

                  <div className="grid grid-cols-2 gap-px bg-white/[0.08] rounded-none overflow-hidden border border-white/[0.08]">
                    <div className="bg-[#050505] p-8 flex flex-col justify-center">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Confidence</p>
                      <p className={cn(
                        "text-[40px] font-bold tracking-tighter leading-none",
                        result.prediction === "fake" ? "text-red-400" : "text-emerald-400"
                      )}>
                        {result.confidence_info}
                      </p>
                    </div>
                    <div className="bg-[#050505] p-8 flex flex-col justify-center">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-foreground/40 mb-2">Frames Scanned</p>
                      <p className="text-[40px] font-bold tracking-tighter leading-none text-white">
                        {result.frames_checked}
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={handleExport}
                    className="w-full py-4 bg-white/[0.03] border border-white/[0.05] text-white font-medium rounded-none hover:bg-white/[0.08] transition-colors text-sm cursor-pointer"
                  >
                    Export Analysis Report
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.2 }}
                  className="flex flex-col items-center justify-center text-center space-y-8"
                >
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-white/40 flex items-center justify-center">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-[12px] font-bold uppercase tracking-widest text-white/60">Analysis Results</p>
                    <p className="max-w-[200px] text-[11px] font-medium leading-relaxed italic">
                      Confidence scores and metrics will appear here once the video scan is complete.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </main>
    </div>
  );
}
