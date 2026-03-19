import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <Empty
        title="Library is Empty"
        description="Your saved assignments, materials, and questions will appear here."
      />
    </DashboardLayout>
  );
}
