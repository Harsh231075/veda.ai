"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useCallback, useEffect, Suspense } from "react";
import { useCreateAssignment } from "@/hooks/useAssignment";
import { useSpeechToText } from "@/hooks/useSpeechToText";
import { useRouter, useSearchParams } from "next/navigation";
import { getAssignmentApi } from "@/services/assignment.service";
import {
  UploadCloud,
  Plus,
  Minus,
  X,
  Mic,
  MicOff,
  ArrowLeft,
  ChevronDown,
  Calendar,
  RefreshCw
} from "lucide-react";

type QuestionType = {
  type: string;
  count: number;
  marks: number;
};

function CreateForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const regenerateId = searchParams.get("regenerate");

  const [questions, setQuestions] = useState<QuestionType[]>([
    { type: "Multiple Choice Questions", count: 4, marks: 1 },
    { type: "Short Questions", count: 3, marks: 2 },
  ]);

  const [dueDate, setDueDate] = useState("");
  const [instructions, setInstructions] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [validationError, setValidationError] = useState("");
  const [prefilling, setPrefilling] = useState(!!regenerateId);
  const [originalSourceMaterial, setOriginalSourceMaterial] = useState("");
  const [useOriginalSource, setUseOriginalSource] = useState(true);

  const { submitAssignment, loading, error } = useCreateAssignment();

  // Pre-fill data when regenerating
  useEffect(() => {
    if (!regenerateId) return;

    const prefillData = async () => {
      try {
        setPrefilling(true);
        const data = await getAssignmentApi(regenerateId);

        // Pre-fill instructions
        if (data.instructions) {
          setInstructions(data.instructions);
        }

        // Pre-fill due date
        if (data.dueDate) {
          const d = new Date(data.dueDate);
          const yyyy = d.getFullYear();
          const mm = String(d.getMonth() + 1).padStart(2, "0");
          const dd = String(d.getDate()).padStart(2, "0");
          setDueDate(`${yyyy}-${mm}-${dd}`);
        }

        // Pre-fill question config
        if (data.questionConfig && data.questionConfig.length > 0) {
          setQuestions(
            data.questionConfig.map((q: any) => ({
              type: q.type || "New Type",
              count: q.count || 1,
              marks: q.marks || 1,
            }))
          );
        }

        // Store original source material for reuse
        if (data.sourceMaterial) {
          setOriginalSourceMaterial(data.sourceMaterial);
          setUseOriginalSource(true);
        }
      } catch (err) {
        console.error("Failed to prefill:", err);
      } finally {
        setPrefilling(false);
      }
    };

    prefillData();
  }, [regenerateId]);

  const handleSpeechResult = useCallback((text: string) => {
    setInstructions((prev) => {
      const trimmed = prev.trim();
      return trimmed ? trimmed + " " + text : text;
    });
  }, []);

  const { isListening, toggleListening, isSupported } = useSpeechToText(handleSpeechResult);

  const handleNext = () => {
    setValidationError("");

    // When regenerating, source material can come from original or new file
    if (!selectedFile && !regenerateId) {
      setValidationError("Please upload a document or image file.");
      return;
    }

    if (regenerateId && !selectedFile && !originalSourceMaterial) {
      setValidationError("Please upload a document or image file.");
      return;
    }

    if (!dueDate) {
      setValidationError("Please select a due date.");
      return;
    }

    if (questions.length === 0) {
      setValidationError("Please add at least one question type.");
      return;
    }

    const validQuestions = questions.filter(q => q.type.trim() && q.count > 0 && q.marks > 0);
    if (validQuestions.length === 0) {
      setValidationError("At least one question type must have valid Name, Count and Marks.");
      return;
    }

    // If regenerating and no new file uploaded, pass the original source material as text
    if (regenerateId && !selectedFile && originalSourceMaterial && useOriginalSource) {
      submitAssignment(dueDate, instructions, questions, undefined, originalSourceMaterial);
    } else {
      submitAssignment(dueDate, instructions, questions, selectedFile);
    }
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

  // Loading state while pre-filling
  if (prefilling) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
          <p className="text-sm text-gray-500 font-medium">Loading assignment data...</p>
        </div>
      </DashboardLayout>
    );
  }

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
            {regenerateId ? "Regenerate" : "Create Assignment"}
          </h2>
          <div className="w-10" />
        </div>

        {/* REGENERATE BANNER */}
        {regenerateId && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-4 mb-6 flex items-start gap-3">
            <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm border border-amber-200/50 flex-shrink-0 mt-0.5">
              <RefreshCw size={16} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">Regenerating Assignment</p>
              <p className="text-xs text-amber-700/80 mt-0.5 leading-relaxed">
                Previous data has been pre-filled. Modify any inputs and submit to generate a new version.
              </p>
            </div>
          </div>
        )}

        {/* PROGRESS BAR */}
        <div className="w-full h-1 bg-gray-200 rounded-full mb-6 overflow-hidden">
          <div className="w-1/2 h-full bg-black rounded-full transition-all duration-300"></div>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.08)] mb-6">
          
          <h2 className="text-lg font-semibold text-gray-900">Assignment Details</h2>
          <p className="text-sm text-gray-400 mb-6">
            {regenerateId 
              ? "Review and modify the details below, then regenerate" 
              : "Basic information about your assignment"}
          </p>

          {/* UPLOAD */}
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={(e) => {
              setSelectedFile(e.target.files?.[0]);
              if (e.target.files?.[0]) {
                setUseOriginalSource(false);
              }
            }}
          />

          <div
            onClick={() => document.getElementById("file-upload")?.click()}
            className="border-2 border-dashed border-gray-300 hover:border-black rounded-2xl p-8 text-center bg-gray-50/50 hover:bg-gray-50 mb-6 cursor-pointer transition-all duration-200 group"
          >
            <div className="w-11 h-11 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-sm border border-gray-100 group-hover:scale-105 transition-transform duration-200">
              <UploadCloud size={20} className="text-gray-500" />
            </div>
            <p className="text-sm font-medium">
              {selectedFile 
                ? selectedFile.name 
                : regenerateId && originalSourceMaterial && useOriginalSource
                  ? "Using previous source material"
                  : "Choose a file or drag & drop it here"}
            </p>
            <p className="text-xs text-gray-400 mt-1 mb-4">
              {regenerateId && originalSourceMaterial && !selectedFile
                ? "Upload a new file to replace the previous source material"
                : "Upload images of your preferred document/image"}
            </p>
            <span className="inline-block px-4 py-2 bg-white border border-gray-200 rounded-full text-sm shadow-sm hover:shadow-md transition-shadow">
              {selectedFile ? "Change File" : regenerateId && originalSourceMaterial ? "Replace File" : "Browse Files"}
            </span>
          </div>

          {/* Show revert option if user uploaded new file during regeneration */}
          {regenerateId && originalSourceMaterial && selectedFile && (
            <button
              onClick={() => {
                setSelectedFile(undefined);
                setUseOriginalSource(true);
                // Reset file input
                const fileInput = document.getElementById("file-upload") as HTMLInputElement;
                if (fileInput) fileInput.value = "";
              }}
              className="text-xs text-amber-600 hover:text-amber-800 font-medium mb-4 flex items-center gap-1 transition"
            >
              <RefreshCw size={12} /> Revert to original source material
            </button>
          )}

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

          {(error || validationError) && <p className="text-red-500 text-sm mt-3">{error || validationError}</p>}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between mt-6 mb-16">
          <button 
            onClick={() => router.back()}
            className="px-6 py-3 bg-gray-200 rounded-full text-sm hover:bg-gray-300 active:scale-95 transition-all"
          >
            {regenerateId ? "Cancel" : "Previous"}
          </button>

          <button
            disabled={loading}
            onClick={handleNext}
            className="px-6 py-3 bg-black text-white rounded-full text-sm hover:bg-gray-800 active:scale-95 transition-all flex items-center gap-2"
          >
            {loading 
              ? (regenerateId ? "Regenerating..." : "Creating...") 
              : regenerateId 
                ? <><RefreshCw size={14} /> Regenerate</>
                : "Next →"}
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
}

export default function CreateAssignmentPage() {
  return (
    <Suspense fallback={
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex gap-2">
            <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:0ms]" />
            <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
            <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
          </div>
        </div>
      </DashboardLayout>
    }>
      <CreateForm />
    </Suspense>
  );
}