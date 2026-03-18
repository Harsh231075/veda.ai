// components/FilterBar.tsx
"use client";

import { Search, Filter } from "lucide-react";

export default function FilterBar() {
  return (
    <div className="flex flex-col md:flex-row gap-3 mt-4">

      {/* Filter */}
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm">
        <Filter size={18} />
        <span className="text-sm text-gray-500">Filter</span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm flex-1">
        <Search size={18} />
        <input
          placeholder="Search Assignment"
          className="w-full outline-none text-sm"
        />
      </div>
    </div>
  );
}