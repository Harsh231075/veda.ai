"use client";

import { Bell, Menu } from "lucide-react";

export default function MobileHeader() {
  return (
    <div className="md:hidden px-3 pt-3">
      <div className="flex items-center justify-between bg-gray-200 rounded-3xl px-4 py-3 shadow-sm">

        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/myvedaai_logo.jpeg"
            alt="VedaAI"
            className="w-10 h-10 rounded-xl object-cover"
          />
          <h1 className="text-lg font-semibold text-black">VedaAI</h1>
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
            className="w-10 h-10 rounded-full object-cover"
          />

          {/* Menu */}
          <Menu size={24} className="text-black" />
        </div>
      </div>
    </div>
  );
}