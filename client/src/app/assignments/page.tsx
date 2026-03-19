// app/assignments/page.tsx
"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import FilterBar from "@/components/FilterBar";
import AssignmentGrid from "@/components/AssignmentGrid";
import { useGetAssignments } from "@/hooks/useAssignment";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AssignmentsPage() {
  const { assignments, loading, error, refetch } = useGetAssignments();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const router = useRouter();

  return (
    <DashboardLayout>
      
      {/* SECONDARY HEADER for Mobile */}
      <div className="md:hidden flex items-center justify-center relative mt-4 mb-2">
        <button 
          onClick={() => router.back()} 
          className="absolute left-0 p-2 bg-white rounded-full shadow-sm border border-gray-100 active:scale-95 transition"
        >
          <ArrowLeft size={16} className="text-gray-700" />
        </button>
        <h2 className="text-base font-bold text-gray-900">Assignments</h2>
      </div>

      <div className="hidden md:block mt-4">
        <p className="text-sm text-gray-600">Manage and create assignments for your classes.</p>
      </div>

      <div className="mt-4">
        <FilterBar search={search} onSearchChange={setSearch} status={status} onStatusChange={setStatus} />
      </div>

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