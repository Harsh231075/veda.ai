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
    <div className="flex flex-row gap-2 mt-4 items-center w-full">

      {/* Filter / Status */}
      <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl shadow-sm">
        <Filter size={18} />
        <select
          value={status}
          onChange={(e) => onStatusChange?.(e.target.value)}
          className="text-sm outline-none bg-transparent"
        >
          <option value="ALL">All</option>
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="COMPLETED">Completed</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm flex-1">
        <Search size={18} />
        <input
          placeholder="Search Assignment"
          className="w-full outline-none text-sm"
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
    </div>
  );
}