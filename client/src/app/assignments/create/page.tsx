"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useCallback } from "react";
import { useCreateAssignment } from "@/hooks/useAssignment";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  Plus,
  Minus,
  X,
  Mic,
  MicOff,
  ArrowLeft,
  ChevronDown,
  Calendar
} from "lucide-react";

type QuestionType = {
  type: string;
  count: number;
  marks: number;
};

export default function CreateAssignmentPage() {
  const router = useRouter();
  const [questions, setQuestions] = useState<QuestionType[]>([
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
  ]);

  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();

  const { submitAssignment, loading, error } = useCreateAssignment();

  const handleSpeechResult = useCallback((text: string) => {
    setInstructions((prev) => {
      const trimmed = prev.trim();
      return trimmed ? trimmed + " " + text : text;
    });
  }, []);

  const { isListening, toggleListening, isSupported } = useSpeechToText(handleSpeechResult);

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
      <div className="mt-4 max-w-3xl mx-auto">
        
        {/* Secondary Header - Mobile Only */}
        <div className="md:hidden flex items-center justify-between mb-6 relative">
          <button 
            onClick={() => router.back()} 
            className="w-10 h-10 flex items-center justify-center bg-white rounded-full shadow-sm border border-gray-100 active:scale-95 transition-all"
          >
            <ArrowLeft size={18} className="text-gray-700" />
          </button>
          <h2 className="absolute left-1/2 -translate-x-1/2 text-lg font-semibold text-gray-900 tracking-tight">
            Create Assignment
          </h2>
          <div className="w-10" />
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="w-1/2 h-full bg-black rounded-full transition-all duration-300"></div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] mb-6">
          
          <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
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
            className="border-2 border-dashed border-gray-300 hover:border-black rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 mb-6 cursor-pointer transition-all duration-200 group"
          >
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-200">
              <UploadCloud size={20} className="text-gray-500" />
            </div>
            <p className="text-sm font-medium">
              {selectedFile ? selectedFile.name : "Choose a file or drag & drop it here"}
            </p>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              Upload images of your preferred document/image
            </p>
            <span className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow">
              {selectedFile ? "Change File" : "Browse Files"}
            </span>
          </div>

          {/* DATE */}
          <div className="relative mb-6">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-gray-50/50 px-6 py-3.5 pr-12 text-sm outline-none focus:border-black transition-all cursor-pointer text-gray-800"
            />
            <Calendar size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>

          {/* QUESTION TYPES - Redesigned Cards */}
          <div className="space-y-4">
            {questions.map((q, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl md:rounded-full p-4 md:py-3 md:px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 relative border border-gray-100/50 md:border-transparent"
              >
                <div className="flex items-center justify-between w-full md:flex-1 md:mr-6">
                  <input
                    value={q.type}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[i].type = e.target.value;
                      setQuestions(updated);
                    }}
                    className="bg-transparent outline-none text-sm font-medium w-2/3 md:w-full"
                    placeholder="Question Type"
                  />
                  <div className="flex items-center gap-2 md:hidden">
                    <button className="text-gray-400">
                      <ChevronDown size={18} />
                    </button>
                    <button onClick={() => removeType(i)} className="text-gray-400 hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:flex md:items-center gap-4 md:gap-4 w-full md:w-auto">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block md:hidden">No. of Questions</label>
                    <div className="flex items-center justify-between bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
                      <button 
                        onClick={() => updateValue(i, "count", q.count - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition"
                      >
                        <Minus size={12} className="text-gray-600" />
                      </button>
                      <span className="text-sm">{q.count}</span>
                      <button 
                        onClick={() => updateValue(i, "count", q.count + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition"
                      >
                        <Plus size={12} className="text-gray-600" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 mb-1 block md:hidden">Marks</label>
                    <div className="flex items-center justify-between bg-white rounded-full px-3 py-1.5 shadow-sm border border-gray-100">
                      <button 
                        onClick={() => updateValue(i, "marks", q.marks - 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition"
                      >
                        <Minus size={12} className="text-gray-600" />
                      </button>
                      <span className="text-sm">{q.marks}</span>
                      <button 
                        onClick={() => updateValue(i, "marks", q.marks + 1)}
                        className="w-6 h-6 flex items-center justify-center bg-gray-50 rounded-full hover:bg-gray-100 transition"
                      >
                        <Plus size={12} className="text-gray-600" />
                      </button>
                    </div>
                  </div>
                  
                  <button onClick={() => removeType(i)} className="hidden md:block text-gray-500 hover:text-red-500">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* ADD TYPE */}
          <div
            onClick={addType}
            className="flex items-center gap-2 mt-4 cursor-pointer w-fit"
          >
            <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center shadow-md">
              <Plus size={16} className="text-white" />
            </div>
            <span className="text-sm font-medium">Add Question Type</span>
          </div>

          {/* TOTAL */}
          <div className="text-right text-sm text-gray-600 mt-6">
            <p>Total Questions: {totalQuestions}</p>
            <p>Total Marks: {totalMarks}</p>
          </div>

          {/* TEXTAREA + MIC */}
          <div className="relative mt-8">
            <label className="text-sm font-medium mb-2 block">
              Additional Information (For better output)
            </label>

            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 hover:bg-gray-50 focus:bg-white p-4 pr-14 text-sm font-medium outline-none focus:border-black transition-all resize-none shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              rows={4}
              placeholder="e.g Generate a question paper for 3 hour exam duration..."
            />

            {isSupported && (
              <div className="absolute bottom-4 right-4 flex items-center justify-center">
                {isListening && (
                  <span className="absolute w-10 h-10 bg-red-400 rounded-full animate-ping opacity-75"></span>
                )}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`w-9 h-9 flex items-center justify-center rounded-full shadow-md border border-gray-100 transition-all z-10 ${
                    isListening
                      ? "bg-red-500 text-white"
                      : "bg-black text-white hover:bg-gray-800 hover:scale-110 active:scale-95"
                  }`}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff size={16} /> : <Mic size = {16} />}
                </button>
              </div>
            )}

            {isListening && (
              <p className="text-xs text-red-500 mt-1 flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                Listening... Speak now
              </p>
            )}
          </div>

          {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-6 mb-16">
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

        {/* Floating Add Question button for Mobile */}
        <button 
          onClick={addType}
          className="md:hidden fixed bottom-28 right-6 w-14 h-14 bg-black text-white rounded-full flex items-center justify-center shadow-[0_8px_25px_rgba(0,0,0,0.15)] active:scale-95 hover:scale-105 transition-all z-40"
        >
          <Plus size={24} className="stroke-[3]" />
        </button>

      </div>
    </DashboardLayout>
  );
}