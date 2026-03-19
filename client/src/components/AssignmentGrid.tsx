"use client";

import AssignmentCard from "./AssignmentCard";
import { useGetAssignments } from "@/hooks/useAssignment";
import Empty from "./Empty";

export default function AssignmentGrid() {
  const { assignments, loading, error, refetch } = useGetAssignments();

  if (loading) {
    return <p className="text-gray-500 mt-6">Loading assignments...</p>;
  }

  if (error) {
    return <p className="text-red-500 mt-6">{error}</p>;
  }

  if (assignments.length === 0) {
    return (
      <Empty 
        title="No assignments yet" 
        description="Create your first assignment to start collecting and grading student submissions with AI assist." 
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
      {assignments.map((assignment) => (
        <AssignmentCard key={assignment._id} assignment={assignment} refetch={refetch} />
      ))}
    </div>
  );
}