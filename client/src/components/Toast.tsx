"use client";

import { CheckCircle2, AlertCircle, X } from "lucide-react";

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
  isOpen: boolean;
}

export default function Toast({ message, type = "success", onClose, isOpen }: ToastProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slideUp">
      <div className={`p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-center justify-between gap-3 max-w-sm w-full transition-all ${
        type === "success" 
        ? "bg-green-50/90 border-green-200 text-green-800" 
        : "bg-red-50/90 border-red-200 text-red-800"
      }`}>
        <div className="flex items-center gap-2">
          {type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-black/5 rounded-full">
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
