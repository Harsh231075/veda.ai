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
      <div className="flex items-center justify-between bg-gray-200 rounded-3xl px-4 py-3 shadow-sm">

        {/* Left - Back + Title */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => router.back()}
            aria-label="Go back"
            className="bg-gray-300 p-2 rounded-full shrink-0"
          >
            <ArrowLeft size={18} className="text-black" />
          </button>

          <div className="min-w-0">
            <h1 className="text-base font-semibold text-black truncate">{pageTitle}</h1>
            <p className="text-xs text-gray-700 truncate">{userName}</p>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">

          {/* Notification */}
          <div className="relative bg-gray-300 p-2 rounded-full">
            <Bell size={20} className="text-black" />
            <span className="absolute top-0 right-0 w-3 h-3 bg-orange-500 rounded-full"></span>
          </div>

          {/* Profile */}
          <img
            src="https://i.pravatar.cc/40"
            alt={userName}
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Menu */}
          <Menu size={24} className="text-black" />
        </div>
      </div>
    </div>
  );
}