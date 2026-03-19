"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileHeader from "./MobileHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    let ok = false;
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.role === "teacher") {
          ok = true;
        }
      }
    } catch {
      // ignore parsing errors
    }

    if (!ok) {
      router.replace("/login");
    } else {
      setAllowed(true);
    }
    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Checking access...</p>
      </div>
    );
  }

  if (!allowed) {
    return null;
  }

  return (
    <div className="flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto md:ml-72">
        <div className="sticky top-0 z-40 bg-gray-100 px-4 md:px-6 pt-3 md:pt-6">
          <MobileHeader />
          <div className="hidden md:block">
            <Header />
          </div>
        </div>

        <div className="px-4 md:px-6 pb-28">
          {children}
        </div>
      </main>
    </div>
  );
}
