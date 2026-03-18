// components/AssignmentCard.tsx
"use client";

import { MoreVertical } from "lucide-react";

export default function AssignmentCard() {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm relative hover:shadow-md transition">

      {/* Menu */}
      <div className="absolute top-4 right-4 cursor-pointer">
        <MoreVertical size={18} />
      </div>

      {/* Title */}
      <h2 className="font-semibold text-lg mb-6 underline">
        Quiz on Electricity
      </h2>

      {/* Dates */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>
          <strong>Assigned on:</strong> 20-06-2025
        </span>
        <span>
          <strong>Due:</strong> 21-06-2025
        </span>
      </div>
    </div>
  );
}