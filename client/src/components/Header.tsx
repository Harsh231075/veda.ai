// components/Header.tsx
"use client";

import { Bell, ArrowLeft } from "lucide-react";

export default function Header() {
  return (
    <div className="flex items-center justify-between p-4 bg-white/80 border border-gray-200/60 rounded-xl shadow-sm backdrop-blur-sm">

      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} />
        </button>
        <h1 className="font-semibold text-lg text-gray-900">Assignments</h1>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <Bell size={20} />
        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/30"
            className="w-8 h-8 rounded-full"
          />
          <span className="hidden md:block text-sm text-gray-700">John Doe</span>
        </div>
      </div>
    </div>
  );
}