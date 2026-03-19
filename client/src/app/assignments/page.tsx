// app/assignments/page.tsx
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import AssignmentGrid from "@/components/AssignmentGrid";
import { useGetAssignments } from "@/hooks/useAssignment";
import { useState } from "react";

export default function AssignmentsPage() {
  const { assignments, loading, error, refetch } = useGetAssignments();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  return (
    <DashboardLayout>
      <div className="mt-4">
        <p className="text-sm text-gray-600">Manage and create assignments for your classes.</p>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />

      <AssignmentGrid assignments={assignments} search={search} status={status} />

      {/* Bottom Bar for Desktop */}
      <div className="fixed bottom-0 md:left-72 left-0 right-0 p-4 bg-white/70 backdrop-blur-md border-t border-gray-100 z-10 hidden md:flex justify-center">
        <Link href="/assignments/create">
          <button className="bg-black text-white px-6 py-3 rounded-full shadow-lg">
            + Create Assignment
          </button>
        </Link>
      </div>
    </DashboardLayout>
  );
}