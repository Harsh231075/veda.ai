// components/FilterBar.tsx
"use client";

import { Search, Filter } from "lucide-react";

export default function FilterBar({
  search = "",
  onSearchChange,
  status = "ALL",
  onStatusChange,
}: {
  search?: string;
  onSearchChange?: (v: string) => void;
  status?: string;
  onStatusChange?: (v: string) => void;
}) {
  return (
    <div className="flex flex-row gap-2 mt-4 items-center w-full bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] border border-gray-100">

      {/* Filter / Status */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100">
        <Filter size={15} className="text-gray-500" />
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="text-xs outline-none bg-transparent font-medium text-gray-700"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3 py-1.5 flex-1">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search Assignment"
          className="w-full outline-none text-xs bg-transparent text-gray-800 placeholder-gray-400"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}