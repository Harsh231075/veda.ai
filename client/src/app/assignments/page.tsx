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

      <div className="fixed bottom-0 md:left-72 left-0 right-0 p-4 
bg-white/60 backdrop-blur-xl supports-[backdrop-filter]:bg-white/50 
border-t border-gray-200 z-20 hidden md:flex justify-center">

        <Link href="/assignments/create">
          <button className="bg-black text-white px-6 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
            + Create Assignment
          </button>
        </Link>

      </div>
    </DashboardLayout>
  );
}