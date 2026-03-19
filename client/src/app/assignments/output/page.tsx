"use client";
import React, { Suspense } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "next/navigation";
import { useAssignmentOutput } from "@/hooks/useAssignmentOutput";

function OutputContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { assignment, loading, publishing, publish, toast, setToast } = useAssignmentOutput(id);

    if (loading || !assignment || assignment.status === "PENDING" || assignment.status === "PROCESSING") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                <p className="font-medium">AI is generating your question paper...</p>
                <p className="text-sm text-gray-500 mt-2">This may take a few seconds as Gemini handles your instruction sets.</p>
            </div>
        );
    }

    if (assignment.status === "FAILED") {
        return (
            <div className="text-center text-red-500 mt-20 flex flex-col items-center justify-center">
                <p className="font-semibold text-lg">Failed to generate assignment.</p>
                <p className="text-sm text-gray-500 mt-1 mb-4">Gemini API encountered an exception processing this job.</p>
                <button
                    onClick={() => window.location.href = "/assignments/create"}
                    className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                    Try Recreating
                </button>
            </div>
        );
    }

    const sections = assignment.generatedPaper?.sections || [];

    return (
        <div className="relative">

            {/* TOAST POPUP */}
            {toast && (
                <div className={`fixed top-24 md:top-5 right-5 p-4 rounded-xl shadow-lg border text-white animate-bounce flex items-center gap-2 z-50 ${toast.type === 'success' ? 'bg-green-600 border-green-700' : 'bg-red-600 border-red-700'
                    }`}>
                    <span className="font-medium text-sm">{toast.message}</span>
                    <button onClick={() => setToast(null)} className="ml-2 font-bold text-lg leading-none">×</button>
                </div>
            )}

            <div className="max-w-4xl mx-auto">
                {/* HEADERS */}
                <div className="flex justify-end items-center mb-6">
                    <button
                        onClick={publish}
                        disabled={publishing || assignment.isPublished}
                        className="bg-black text-white px-6 py-2 rounded-full font-medium shadow-md transition active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                    >
                        {assignment.isPublished ? "Already Published" : publishing ? "Publishing..." : "Save & Publish Paper"}
                    </button>
                </div>

                {/* PAPER BODY CONTAINER */}
                <div className="bg-white p-6 md:p-12 rounded-2xl shadow-md border">

                    {/* PAPER DETAILS SECTION */}
                    <div className="border-b-2 border-dashed border-gray-300 pb-8 mb-8 text-center">
                        <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 uppercase text-gray-800">
                            VedaAI Internal Assessment
                        </h2>

                        <div className="flex flex-col md:flex-row justify-between gap-6 px-4 md:px-0 text-left">
                            <div className="flex-1 border-b border-gray-300 pb-2">
                                <span className="text-gray-500 font-semibold mr-2">Name:</span>
                                <span className="inline-block w-full h-4"></span>
                            </div>
                            <div className="flex-1 border-b border-gray-300 pb-2">
                                <span className="text-gray-500 font-semibold mr-2">Roll No:</span>
                            </div>
                            <div className="flex-1 border-b border-gray-300 pb-2">
                                <span className="text-gray-500 font-semibold mr-2">Section:</span>
                            </div>
                        </div>
                    </div>

                    {/* SECTIONS */}
                    {sections.map((section: any, sIdx: number) => (
                        <div key={sIdx} className="mb-12">
                            <div className="mb-6">
                                <h3 className="font-extrabold text-xl mb-1 text-gray-900 border-b border-gray-100 pb-2">{section.title}</h3>
                                {section.instructions && (
                                    <p className="text-sm font-medium text-gray-600 mt-2 bg-gray-50 p-3 rounded-lg border">
                                        Note: {section.instructions}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-8">
                                {section.questions.map((q: any, qIdx: number) => (
                                    <div key={qIdx} className="flex gap-4 p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition">
                                        <span className="font-bold text-gray-800 text-lg shrink-0 w-6">
                                            {qIdx + 1}.
                                        </span>
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start gap-4">
                                                <p className="font-medium text-gray-800 text-lg leading-relaxed whitespace-pre-wrap">{q.questionText}</p>

                                                {/* BADGES */}
                                                <div className="flex gap-2 flex-col items-end shrink-0">
                                                    <span className="text-[11px] px-2.5 py-1 bg-black text-white rounded-md font-bold uppercase tracking-wide">
                                                        {q.marks} Marks
                                                    </span>
                                                    <span className={`text-[10px] px-2 py-1 rounded-md font-bold uppercase tracking-wider ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                                                            q.difficulty === 'Moderate' ? 'bg-yellow-100 text-yellow-700' :
                                                                'bg-red-100 text-red-700'
                                                        }`}>
                                                        {q.difficulty}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* MCQ OPTIONS */}
                                            {q.options && q.options.length > 0 && (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                                                    {q.options.map((opt: string, oIdx: number) => (
                                                        <div key={oIdx} className="flex gap-3 items-center group">
                                                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 group-hover:border-black transition-colors flex shrink-0 items-center justify-center"></div>
                                                            <span className="text-gray-700 font-medium group-hover:text-black transition-colors">{opt}</span>
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
                        <p className="text-center text-gray-500 italic py-10">No sections were generated.</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function OutputPage() {
    return (
        <DashboardLayout>
            <Suspense fallback={
                <div className="flex flex-col items-center justify-center min-h-[60vh]">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mb-4"></div>
                    <p>Loading Assignment Viewer...</p>
                </div>
            }>
                <OutputContent />
            </Suspense>
        </DashboardLayout>
    );
}
