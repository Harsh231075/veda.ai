// app/assignments/page.tsx
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import AssignmentGrid from "@/components/AssignmentGrid";

export default function AssignmentsPage() {
  return (
    <DashboardLayout>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Manage and create assignments for your classes.</p>
      </div>

      <FilterBar />

      <AssignmentGrid />

      {/* Floating Button */}
      <Link href="/assignments/create" className="fixed bottom-6 left-1/2 -translate-x-1/2">
        <button className="bg-black text-white px-6 py-3 rounded-full shadow-lg">
          + Create Assignment
        </button>
      </Link>
    </DashboardLayout>
  );
}