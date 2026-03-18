// components/AssignmentGrid.tsx
import AssignmentCard from "./AssignmentCard";

export default function AssignmentGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mt-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <AssignmentCard key={i} />
      ))}
    </div>
  );
}