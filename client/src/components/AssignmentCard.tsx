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
      setIsDeleting(false);
      setIsConfirmOpen(false);
      setToast({ isOpen: true, message: "Assignment deleted successfully!", type: "success" });
      setTimeout(() => {
        if (refetch) refetch();
      }, 1200);
    } catch (err: any) {
      setToast({ isOpen: true, message: "Failed: " + err.message, type: "error" });
      setIsDeleting(false);
    }
  };

  const titleText = assignment.title || assignment.instructions || "Untitled Assignment";
  const truncatedTitle = titleText.length > 50 ? titleText.slice(0, 50) + "..." : titleText;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm relative hover:shadow-md transition">

      {/* Status Badge */}
      <span className={`absolute top-4 right-12 text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(assignment.status)}`}>
        {assignment.status}
      </span>

      {/* Menu Trigger */}
      <div
        className="absolute top-4 right-4 cursor-pointer p-1 hover:bg-gray-100 rounded-full"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        <MoreVertical size={18} />
      </div>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-4 top-12 bg-white border border-gray-100 rounded-xl shadow-lg w-44 z-10 py-1 overflow-hidden">
          <Link href={`/assignments/output?id=${assignment._id}`} className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
            <Eye size={16} />
            View Assignment
          </Link>
          <button
            onClick={() => { setIsConfirmOpen(true); setShowDropdown(false); }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      )}

      {/* Title */}
      <h2 className="font-semibold text-lg mb-4 underline pr-28 break-words">
        {truncatedTitle}
      </h2>

      {/* Dates */}
      <div className="flex flex-col sm:flex-row sm:justify-between text-xs sm:text-sm text-gray-500 gap-1 sm:gap-0 mt-auto">
        <span>
          <strong>Assigned:</strong> {formattedDate(assignment.createdAt)}
        </span>
        <span>
          <strong>Due:</strong> {formattedDate(assignment.dueDate)}
        </span>
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