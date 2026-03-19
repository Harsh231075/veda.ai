// app/page.tsx

import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function Home() {
  return (
    <DashboardLayout>
      <Empty
        title="Welcome to VedaAI"
        description="Manage your classes, students, and create assignments effortlessly using AI assistance."
        imageSrc="/undraw_no-data_ig65.svg"
      />
    </DashboardLayout>
  );
}