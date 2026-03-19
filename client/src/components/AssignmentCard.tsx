import { useState } from "react";
import { MoreVertical, Eye, Trash2 } from "lucide-react";
import { deleteAssignmentApi } from "@/services/assignment.service";
import Link from "next/link";
import ConfirmationModal from "./ConfirmationModal";
import Toast from "./Toast";

export default function AssignmentCard({ assignment, refetch }: { assignment: any; refetch?: () => void }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; message: string; type: "success" | "error" }>({
    isOpen: false,
    message: "",
    type: "success",
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED": return "bg-green-100 text-green-800";
      case "PROCESSING": return "bg-blue-100 text-blue-800";
      case "FAILED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formattedDate = (d: string) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString();
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteAssignmentApi(assignment._id);
      setIsConfirmOpen(false);
      
      if (refetch) refetch();
    } catch (err: any) {
      setToast({ isOpen: true, message: "Failed: " + err.message, type: "error" });
      setIsDeleting(false);
    }
  };

  const titleText = assignment.title || assignment.instructions || "Untitled Assignment";
  const truncatedTitle = titleText.length > 50 ? titleText.slice(0, 50) + "..." : titleText;

  return (
    <div className="bg-white p-6 rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-gray-50/50 hover:shadow-[0_16px_50px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col md:min-h-[165px] justify-between">

      {/* Header - Title & Menu */}
      <div className="flex justify-between items-start gap-4 mb-3">
        <h2 className="font-bold text-gray-900 text-base md:text-lg leading-snug break-words flex-1 pr-6">
          {truncatedTitle}
        </h2>
        
        {/* Actions */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold tracking-wide ${getStatusColor(assignment.status)}`}>
            {assignment.status}
          </span>
          <div
            className="cursor-pointer p-1.5 hover:bg-gray-50 rounded-full transition"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <MoreVertical size={16} className="text-gray-400" />
          </div>
        </div>
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-4 top-12 bg-white/95 backdrop-blur-md border border-gray-100 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.08)] w-44 z-20 py-1 overflow-hidden animate-fadeIn">
          <Link href={`/assignments/output?id=${assignment._id}`} className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition">
            <Eye size={16} className="text-gray-400" />
            View Output
          </Link>
          <button
            onClick={() => { setIsConfirmOpen(true); setShowDropdown(false); }}
            className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left transition"
          >
            <Trash2 size={16} className="text-red-400" />
            Delete
          </button>
        </div>
      )}

      {/* Dates row */}
      <div className="flex flex-row justify-between items-center text-xs text-gray-400 gap-1 mt-auto pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-500">Assigned:</span> 
          <span>{formattedDate(assignment.createdAt)}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-medium text-gray-500">Due:</span> 
          <span className="font-semibold text-gray-700">{formattedDate(assignment.dueDate)}</span>
        </div>
      </div>

      {/* Modals & Toast */}
      <ConfirmationModal
        isOpen={isConfirmOpen}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${truncatedTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setIsConfirmOpen(false)}
        isLoading={isDeleting}
      />

      <Toast
        isOpen={toast.isOpen}
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}