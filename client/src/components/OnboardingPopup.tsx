"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, RotateCw, Trash2, Edit, FileText } from "lucide-react";

export default function OnboardingPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDismissed = localStorage.getItem("veda_onboarding_dismissed");
      if (!isDismissed) {
        const timer = setTimeout(() => setIsOpen(true), 800);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleDismiss = () => {
    if (typeof window !== "undefined" && dontShowAgain) {
      localStorage.setItem("veda_onboarding_dismissed", "true");
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const features = [
    {
      icon: <FileText className="text-gray-700" size={18} />,
      title: "Create Content",
      description: "Generate structured question papers easily",
      highlight: false,
    },
    {
      icon: <RotateCw className="text-orange-500" size={18} />,
      title: "Regenerate Paper",
      description: "Quickly retweak outputs with tweaked inputs",
      highlight: true,
    },
    {
      icon: <Edit className="text-gray-700" size={18} />,
      title: "Edit & Update",
      description: "Refine specifications on the go",
      highlight: false,
    },
    {
      icon: <Trash2 className="text-gray-700" size={18} />,
      title: "Delete Items",
      description: "Organize items with full deletion access",
      highlight: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
      
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-[0_20px_60px_rgba(0,0,0,0.15)] animate-in zoom-in-95 duration-200 relative flex flex-col border border-gray-100">
        
        {/* Close Icon */}
        <button 
          onClick={handleDismiss}
          className="absolute right-4 top-4 p-1.5 hover:bg-gray-100 rounded-full transition-all text-gray-400 hover:text-gray-600"
        >
          <X size={16} />
        </button>

        {/* Header with VedaAI Logo */}
        <div className="text-center">
          <img
            src="/myvedaai_logo.jpeg"
            alt="VedaAI"
            className="w-12 h-12 rounded-xl object-cover mx-auto mb-3 shadow-sm"
          />
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">Explore Veda AI</h2>
          <p className="text-xs text-gray-400 mt-0.5">Test out these available actions:</p>
        </div>

        {/* Feature List */}
        <div className="mt-5 space-y-2.5">
          {features.map((item, index) => (
            <div 
              key={index}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                item.highlight 
                  ? "bg-orange-50/40 border-orange-200/50" 
                  : "bg-gray-50/50 border-gray-100/80"
              }`}
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                item.highlight ? "bg-orange-100" : "bg-white border border-gray-100 shadow-sm"
              }`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="text-sm font-semibold text-gray-800">{item.title}</h3>
                  {item.highlight && (
                    <span className="text-[10px] bg-orange-200 text-orange-900 px-1.5 py-0.5 rounded-full font-medium">New</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Footer actions */}
        <div className="mt-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 cursor-pointer">
            <input
              type="checkbox"
              id="dontShowAgain"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className="w-3.5 h-3.5 rounded border-gray-300 text-black focus:ring-gray-900 cursor-pointer"
            />
            <label htmlFor="dontShowAgain" className="text-[11px] text-gray-400 cursor-pointer select-none">
              Don't show again
            </label>
          </div>
          
          <button 
            onClick={handleDismiss}
            className="px-5 py-2 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-full transition-all active:scale-95 shadow-sm"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
