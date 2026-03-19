// components/Header.tsx
"use client";

import { Bell, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePageTitle from "@/hooks/usePageTitle";

export default function Header({ title }: { title?: string }) {
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
    <div className="flex items-center justify-between p-4 bg-white/80 border border-gray-200/60 rounded-xl shadow-sm backdrop-blur-sm">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Go back"
          className="p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-lg text-gray-900">{pageTitle}</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={20} />
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/30"
            alt={userName}
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden md:block text-sm text-gray-700">{userName}</span>
        </div>
      </div>
    </div>
  );
}