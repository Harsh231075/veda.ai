"use client";

import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 p-6 bg-gray-100 overflow-y-auto">{children}</main>
    </div>
  );
}
