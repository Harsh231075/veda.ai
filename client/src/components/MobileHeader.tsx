"use client";

import { ArrowLeft, Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePageTitle from "@/hooks/usePageTitle";

export default function MobileHeader({ title }: { title?: string }) {
  const router = useRouter();
  const pageTitle = usePageTitle(title);
  const [userName, setUserName] = useState("John Doe");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      const name = typeof parsed?.name === "string" ? parsed.name : "";
      if (name.trim()) setUserName(name);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between bg-white/90 backdrop-blur-lg rounded-full px-4 py-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-gray-100 mx-2 mt-2">

        {/* Left - Logo + Name */}
        <div className="flex items-center gap-2">
          <img
            src="/myvedaai_logo.jpeg"
            alt="VedaAI"
            className="w-7 h-7 rounded-lg object-cover shadow-sm"
          />
          <h1 className="text-base font-bold text-gray-900 tracking-tight">VedaAI</h1>
        </div>

        {/* Right - Notification + Avatar + Menu */}
        <div className="flex items-center gap-3">

          {/* Notification */}
          <button className="relative p-1.5 hover:bg-gray-50 rounded-full transition active:scale-95">
            <Bell size={19} className="text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          {/* Profile */}
          <button className="rounded-full shadow-sm hover:opacity-90 transition active:scale-95">
            <img
              src="https://i.pravatar.cc/40"
              alt={userName}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
          </button>

          {/* Menu */}
          <button className="p-1 hover:bg-gray-50 rounded-full transition active:scale-95">
            <Menu size={20} className="text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}