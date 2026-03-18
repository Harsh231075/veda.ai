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
      <div className="hidden md:flex w-70 h-screen bg-white p-4 flex-col justify-between rounded-2xl text-black">
        {/* Top */}
        <div>
          <Link href="/" aria-label="VedaAI Home" className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-xl transition-transform hover:scale-105">
              V
            </div>
            <h1 className="text-xl font-semibold">VedaAI</h1>
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
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-black text-white flex justify-around items-center py-3 rounded-t-3xl z-50">
        {menuItems.slice(0, 4).map((item, i) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={i}
              href={item.href}
              className="flex flex-col items-center text-xs"
              style={{ color: "#ffffff" }}
            >
              <Icon size={20} color="#ffffff" />
              <span style={{ color: "#ffffff" }}>{item.name}</span>
            </Link>
          );
        })}
      </div>

      {/* ================= FLOATING BUTTON ================= */}
      <Link href="/assignments/create">
        <button className="md:hidden fixed bottom-20 right-5 bg-white text-orange-500 p-4 rounded-full shadow-lg z-50">
          <Plus size={24} />
        </button>
      </Link>
    </>
  );
}