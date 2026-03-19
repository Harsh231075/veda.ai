import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function LibraryPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Library</h1>
        <Empty 
          title="Library is Empty" 
          description="Your saved assignments, materials, and questions will appear here."
        />
      </div>
    </DashboardLayout>
  );
}
