"use client";

import AssignmentCard from "./AssignmentCard";
import { useGetAssignments } from "@/hooks/useAssignment";
import Empty from "./Empty";

export default function AssignmentGrid({
  assignments: externalAssignments,
  search = "",
  status = "ALL",
}: {
  assignments?: any[];
  search?: string;
  status?: string;
}) {
  const { assignments: fetched = [], loading, error, refetch } = useGetAssignments();

  const assignments = externalAssignments ?? fetched;

  if (loading && !externalAssignments) {
    return <p className="text-gray-500 mt-6">Loading assignments...</p>;
  }

  if (error && !externalAssignments) {
    return <p className="text-red-500 mt-6">{error}</p>;
  }

  // apply client-side filters
  const filtered = assignments.filter((a: any) => {
    const q = search?.toLowerCase().trim();
    if (q) {
      const title = (a.title || "").toLowerCase();
      const instr = (a.instructions || "").toLowerCase();
      if (!title.includes(q) && !instr.includes(q)) return false;
    }

    if (status && status !== "ALL") {
      if ((a.status || "").toUpperCase() !== status.toUpperCase()) return false;
    }

    return true;
  });

  if (!assignments || assignments.length === 0) {
    return (
      <Empty
        title="No assignments yet"
        description="Create your first assignment to start collecting and grading student submissions with AI assist."
      />
    );
  }

  if (filtered.length === 0) {
    return (
      <Empty title="No matching assignments" description="Try adjusting the filters or search term." />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
      {filtered.map((assignment) => (
        <AssignmentCard key={assignment._id} assignment={assignment} refetch={refetch} />
      ))}
    </div>
  );
}