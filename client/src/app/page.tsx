// app/page.tsx

import DashboardLayout from "@/components/DashboardLayout";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-2">Welcome to VedaAI dashboard.</p>
      </div>
    </DashboardLayout>
  );
}