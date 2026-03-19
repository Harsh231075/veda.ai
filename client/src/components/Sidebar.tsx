"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  FileText,
  BookOpen,
  Clock,
  Settings,
  Plus,
} from "lucide-react";

const menuItems = [
  { name: "Home", icon: Home, href: "/" },
  { name: "My Groups", icon: Users, href: "/groups" },
  { name: "Assignments", icon: FileText, href: "/assignments" },
  { name: "Library", icon: Clock, href: "/library" },
  { name: "AI Toolkit", icon: BookOpen, href: "/ai-toolkit" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* ================= DESKTOP SIDEBAR ================= */}
      <div className="hidden md:flex md:w-72 md:fixed md:inset-y-0 md:left-0 bg-white p-4 flex-col justify-between rounded-2xl text-black">
        {/* Top */}
        <div>
          <Link href="/" aria-label="VedaAI Home" className="flex items-center gap-2 mb-6">
            <img
              src="/myvedaai_logo.jpeg"
              alt="VedaAI"
              className="w-10 h-10 rounded-lg object-cover"
            />
            <h1 className="text-2xl font-semibold">VedaAI</h1>
          </Link>
          <Link href="/assignments/create" className="w-full mb-6 block">
            <button className="w-full py-3 rounded-full bg-black text-white border-2 border-orange-400 shadow-md hover:scale-105 transition">
              ✨ Create Assignment
            </button>
          </Link>

          <div className="space-y-2">
            {menuItems.map((item, i) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                pathname?.startsWith(item.href + "/");

              return (
                <Link
                  key={i}
                  href={item.href}
                  className={`flex items-center gap-3 p-3 rounded-lg text-black ${isActive
                    ? "bg-gray-200 text-black font-medium"
                    : "text-black hover:bg-gray-300"
                    }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Bottom */}
        <div>
          <Link
            href="/settings"
            className="flex items-center gap-3 p-3 text-black hover:bg-gray-100 rounded-lg"
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>

          <div className="mt-4 bg-gray-200 p-3 rounded-xl flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/40"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold text-sm">Delhi Public School</p>
              <p className="text-xs text-gray-900">Bokaro Steel City</p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= MOBILE BOTTOM NAV ================= */}
      <div className="md:hidden fixed bottom-4 left-4 right-4 bg-black/85 backdrop-blur-lg border border-white/5 shadow-[0_12px_40px_rgba(0,0,0,0.25)] flex justify-around items-center px-6 py-2 rounded-full z-40">
        {menuItems.map((item, i) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={i}
              href={item.href}
              className="flex flex-col items-center gap-0.5 transition active:scale-95 duration-200"
            >
              <div className={`w-10 h-10 flex items-center justify-center rounded-full transition-all duration-200 ${isActive ? "bg-white/15 shadow-sm" : "bg-transparent"}`}>
                <Icon 
                  size={18} 
                  className={`transition-colors duration-200 ${isActive ? "text-white" : "text-gray-400"}`} 
                />
              </div>
              <span 
                className={`text-[11px] transition-all duration-200 ${isActive ? "font-semibold" : "font-normal"}`} 
                style={{ color: isActive ? "#ffffff" : "#9ca3af" }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>

      {/* ================= FLOATING BUTTON ================= */}
      {pathname !== "/assignments/create" && (
        <Link href="/assignments/create">
          <button className="md:hidden fixed bottom-28 right-6 bg-white text-red-600 p-4 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100 transition active:scale-95 z-40">
            <Plus size={22} className="stroke-[2.5]" />
          </button>
        </Link>
      )}
    </>
  );
}