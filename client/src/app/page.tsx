// app/page.tsx

import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Empty
          title="Welcome to VedaAI"
          description="Manage your classes, students, and create assignments effortlessly using AI assistance."
          imageSrc="/undraw_no-data_ig65.svg"
        />
      </div>
    </DashboardLayout>
  );
}