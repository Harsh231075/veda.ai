"use client";
import React, { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "next/navigation";
import { useAssignmentOutput } from "@/hooks/useAssignmentOutput";
import { RefreshCw, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";

function OutputContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { assignment, loading, publishing, publish, toast, setToast } = useAssignmentOutput(id);

    if (loading || !assignment || assignment.status === "PENDING" || assignment.status === "PROCESSING") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="font-medium">AI is generating your question paper...</p>
            </div>
        );
    }

    if (assignment.status === "FAILED") {
        return (
            <div className="text-center text-red-500 mt-20 flex flex-col items-center justify-center">
                <p className="font-semibold text-lg">Failed to generate assignment.</p>
                <button
                    onClick={() => window.location.href = "/assignments/create"}
                    className="bg-black text-white px-4 py-2 mt-4 text-sm"
                >
                    Try Again
                </button>
            </div>
        );
    }

    const sections = assignment.generatedPaper?.sections || [];

    return (
        <div className="relative">

            {/* TOAST */}
            {toast && (
                <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 text-sm no-print">
                    {toast.message}
                    <button onClick={() => setToast(null)} className="ml-2">×</button>
                </div>
            )}

            {/* TOP ACTIONS */}
            <div className="max-w-4xl mx-auto mt-8 mb-6 flex justify-between items-center no-print">
                <Link href="/assignments" className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-600 hover:text-black transition active:scale-95 bg-white border border-gray-300 hover:border-gray-400 rounded-full py-2 px-3 sm:px-4 shadow-sm">
                    <ArrowLeft size={16} /> Back
                </Link>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.href = "/assignments/create"}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition flex items-center gap-1"
                    >
                        <RefreshCw size={15} /> <span className="hidden sm:inline">Regenerate</span>
                    </button>

                    <button
                        onClick={() => window.print()}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition flex items-center gap-1"
                    >
                        <Download size={15} /> <span className="hidden sm:inline">Download</span>
                    </button>

                    <button
                        onClick={publish}
                        disabled={publishing || assignment.isPublished}
                        className={`px-4 sm:px-5 py-2 text-xs sm:text-sm font-medium rounded-full border transition active:scale-95 flex items-center ${assignment.isPublished
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-black text-white border-black hover:bg-gray-800"
                            }`}
                    >
                        {assignment.isPublished ? "✓ Published" : publishing ? "Publishing..." : "Save & Publish"}
                    </button>
                </div>
            </div>

            {/* PAPER */}
            <div className="py-6 flex justify-center no-print:bg-transparent">
                <div className="w-[794px] min-h-[1123px] bg-white px-12 py-10 text-black border border-gray-200 shadow-sm rounded-lg">

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold uppercase">
                            Delhi Public School
                        </h2>
                    </div>

                    <div className="flex justify-between text-sm mb-6">
                        <span>Time Allowed: 45 minutes</span>
                        <span>Maximum Marks: 20</span>
                    </div>

                    <p className="text-sm mb-6">
                        All questions are compulsory unless stated otherwise.
                    </p>

                    <div className="flex flex-col gap-4 text-sm mb-8">
                        <div>Name: ______________________________</div>
                        <div>Roll No: ____________________________</div>
                        <div>Section: ____________________________</div>
                    </div>

                    {/* SECTIONS */}
                    {sections.map((section: any, sIdx: number) => (
                        <div key={sIdx} className="mb-10">

                            <h3 className="text-center font-semibold text-lg mb-4">
                                {section.title}
                            </h3>

                            {section.instructions && (
                                <p className="text-sm italic mb-4">
                                    {section.instructions}
                                </p>
                            )}

                            <div className="space-y-4 text-sm leading-relaxed">
                                {section.questions.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="flex gap-2">
                                        <span>{qIdx + 1}.</span>

                                        <div>
                                            <p>{q.questionText}</p>

                                            {/* OPTIONS */}
                                            {q.options && q.options.length > 0 && (
                                                <div className="mt-2 space-y-1 ml-4">
                                                    {q.options.map((opt: string, i: number) => (
                                                        <div key={i}>
                                                            ({String.fromCharCode(97 + i)}) {opt}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    {sections.length === 0 && (
                        <p className="text-center text-gray-500 italic">
                            No sections generated
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OutputPage() {
    return (
        <DashboardLayout hideHeader={true}>
            <Suspense fallback={
                <div className="flex justify-center items-center min-h-[60vh]">
                    Loading...
                </div>
            }>
                <OutputContent />
            </Suspense>
        </DashboardLayout>
    );
}