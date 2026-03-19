"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState } from "react";
import { useCreateAssignment } from "@/hooks/useAssignment";
import {
  UploadCloud,
  Plus,
  Minus,
  X,
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

  // update count/marks
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
  const totalMarks = questions.reduce(
    (acc, q) => acc + q.count * q.marks,
    0
  );

  return (
    <DashboardLayout>
      <div className="mt-4">
        {/* PROGRESS */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div className="w-1/2 h-full bg-black rounded-full"></div>
        </div>

        {/* CARD */}
        <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm">

          <h2 className="font-semibold text-lg">Assignment Details</h2>
          <p className="text-sm text-gray-500 mb-4">
            Basic information about your assignment
          </p>

          {/* UPLOAD */}
          <input
            type="file"
            id="file-upload"
            accept=".pdf,.txt"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files?.[0])}
          />
          <div
            onClick={() => document.getElementById("file-upload")?.click()}
            className="border-2 border-dashed rounded-xl p-6 text-center mb-4 cursor-pointer hover:border-black transition-colors"
          >
            <UploadCloud className="mx-auto mb-2" />
            <p className="text-sm">
              {selectedFile ? selectedFile.name : "Choose a file or drag & drop it here"}
            </p>
            <span className="mt-3 inline-block px-4 py-2 bg-gray-100 rounded-full text-sm">
              {selectedFile ? "Change File" : "Browse Files"}
            </span>
          </div>

          {/* DATE */}
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full border rounded-xl px-4 py-2 mb-4"
          />

          {/* QUESTION TYPES */}
          <div className="space-y-3">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-gray-100 p-3 rounded-xl flex flex-col md:flex-row md:items-center md:justify-between gap-3"
              >
                {/* TYPE */}
                <input
                  value={q.type}
                  onChange={(e) => {
                    const updated = [...questions];
                    updated[i].type = e.target.value;
                    setQuestions(updated);
                  }}
                  className="bg-transparent outline-none w-full md:w-1/3"
                />

                {/* CONTROLS */}
                <div className="flex items-center gap-4">

                  {/* COUNT */}
                  <div className="flex items-center bg-white rounded-full px-3 py-1">
                    <button
                      onClick={() => updateValue(i, "count", q.count - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{q.count}</span>
                    <button
                      onClick={() => updateValue(i, "count", q.count + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* MARKS */}
                  <div className="flex items-center bg-white rounded-full px-3 py-1">
                    <button
                      onClick={() => updateValue(i, "marks", q.marks - 1)}
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-2">{q.marks}</span>
                    <button
                      onClick={() => updateValue(i, "marks", q.marks + 1)}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* DELETE */}
                  <button onClick={() => removeType(i)}>
                    <X size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD TYPE */}
          <button
            onClick={addType}
            className="flex items-center gap-2 mt-4 text-sm"
          >
            <Plus size={18} /> Add Question Type
          </button>

          {/* TOTAL */}
          <div className="mt-6 text-right text-sm">
            <p>Total Questions: {totalQuestions}</p>
            <p>Total Marks: {totalMarks}</p>
          </div>

          {/* ADDITIONAL */}
          <textarea
            placeholder="Additional instructions..."
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            className="w-full border rounded-xl px-4 py-3 mt-4"
          ></textarea>
          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* FOOTER BUTTONS */}
        <div className="flex justify-between mt-6">
          <button className="px-5 py-2 bg-gray-200 rounded-full">
            Previous
          </button>
          <button
            disabled={loading}
            onClick={handleNext}
            className="px-5 py-2 bg-black text-white rounded-full disabled:opacity-50"
          >
            {loading ? "Creating..." : "Next →"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
