"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useCreateAssignment } from "@/hooks/useAssignment";
import {
  UploadCloud,
  Plus,
  Minus,
  X,
  Mic
} from "lucide-react";

type QuestionType = {
  type: string;
  count: number;
  marks: number;
};

export default function CreateAssignmentPage() {
  const [questions, setQuestions] = useState<QuestionType[]>([
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
  ]);

  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const { submitAssignment, loading, error } = useCreateAssignment();

  const handleNext = () => {
    submitAssignment(dueDate, instructions, questions, selectedFile);
  };

  const updateValue = (index: number, key: "count" | "marks", value: number) => {
    const updated = [...questions];
    updated[index][key] = Math.max(0, value);
    setQuestions(updated);
  };

  const removeType = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addType = () => {
    setQuestions([
      ...questions,
      { type: "New Type", count: 1, marks: 1 },
    ]);
  };

  const totalQuestions = questions.reduce((acc, q) => acc + q.count, 0);
  const totalMarks = questions.reduce((acc, q) => acc + q.count * q.marks, 0);

  return (
    <DashboardLayout>
      <div className="mt-6">

        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-8">
          <div className="w-1/2 h-full bg-black rounded-full"></div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)]">

          <h2 className="text-lg font-semibold">Assignment Details</h2>
          <p className="text-sm text-gray-400 mb-6">
            Basic information about your assignment
          </p>

          {/* UPLOAD */}
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0])}
          />

          <div
            onClick={() => document.getElementById("file-upload")?.click()}
            className="border-2 border-dashed border-gray-300 rounded-2xl p-10 text-center bg-gray-50 mb-6 cursor-pointer"
          >
            <UploadCloud className="mx-auto mb-2 text-gray-500" />
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "Choose a file or drag & drop it here"}
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, upto 10MB</p>

            <span className="mt-4 inline-block px-4 py-2 bg-white rounded-full text-sm shadow">
              {selectedFile ? "Change File" : "Browse Files"}
            </span>
          </div>

          {/* DATE */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full rounded-full border px-4 py-3 mb-6"
          />

          {/* QUESTION TYPES */}
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-gray-50 rounded-full px-4 py-3"
              >
                {/* TYPE */}
                <input
                  value={q.type}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[i].type = e.target.value;
                    setQuestions(updated);
                  }}
                  className="bg-transparent outline-none w-1/3 text-sm font-medium"
                />

                {/* CONTROLS */}
                <div className="flex items-center gap-4">

                  {/* COUNT */}
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
                    <button onClick={() => updateValue(i, "count", q.count - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{q.count}</span>
                    <button onClick={() => updateValue(i, "count", q.count + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* MARKS */}
                  <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow-sm">
                    <button onClick={() => updateValue(i, "marks", q.marks - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{q.marks}</span>
                    <button onClick={() => updateValue(i, "marks", q.marks + 1)}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* DELETE */}
                  <button onClick={() => removeType(i)}>
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD TYPE */}
          <div
            onClick={addType}
            className="flex items-center gap-2 mt-4 cursor-pointer"
          >
            <div className="w-8 h-8 bg-white border border-gray-200 shadow-sm text-black rounded-full flex items-center justify-center">
              <Plus size={16} />
            </div>
            <span className="text-sm font-medium">Add Question Type</span>
          </div>

          {/* TOTAL */}
          <div className="text-right text-sm text-gray-600 mt-6">
            <p>Total Questions: {totalQuestions}</p>
            <p>Total Marks: {totalMarks}</p>
          </div>

          {/* TEXTAREA + MIC */}
          <div className="relative mt-6">
            <label className="text-sm font-medium mb-2 block">
              Additional Information (For better output)
            </label>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-2xl border p-4 pr-12 text-sm resize-none"
              rows={4}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
            />

            <button className="absolute bottom-4 right-4 text-gray-500 hover:text-black">
              <Mic size={18} />
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-6">
          <button className="px-6 py-3 bg-gray-200 rounded-full text-sm">
            Previous
          </button>

          <button
            disabled={loading}
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white rounded-full text-sm"
          >
            {loading ? "Creating..." : "Next →"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}