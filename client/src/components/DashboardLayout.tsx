"use client";

import Sidebar from "./Sidebar";
import Header from "./Header";
import MobileHeader from "./MobileHeader";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 min-h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 bg-gray-100 overflow-y-auto">
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
