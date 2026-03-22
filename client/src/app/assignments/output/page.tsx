"use client";
import { Suspense, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useSearchParams } from "next/navigation";
import { useAssignmentOutput } from "@/hooks/useAssignmentOutput";
import { RefreshCw, Download, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { downloadPaperViaBackend } from "@/services/downloadPdf";
import { playSuccessSound } from "@/services/playSound";

function OutputContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");
    const { assignment, loading, publishing, publish, toast, setToast } = useAssignmentOutput(id);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadPaperViaBackend(assignment, assignment.title || "Question_Paper");
            setToast({ message: "PDF downloaded successfully", type: "success" });
            playSuccessSound();
            
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } catch (error) {
            setToast({ message: "Failed to download PDF", type: "error" });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } finally {
            setIsDownloading(false);
        }
    };

    if (loading || !assignment || assignment.status === "PENDING" || assignment.status === "PROCESSING") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                {/* Animated dots loader */}
                <div className="flex gap-2">
                    <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:300ms]" />
                </div>

                <div className="text-center">
                    <p className="font-semibold text-lg">Generating your paper</p>
                    <p className="text-sm text-gray-400 mt-1">
                        AI is crafting questions based on your instructions...
                    </p>
                </div>

                {/* Progress steps */}
                <div className="flex flex-col gap-3 mt-4 text-sm">
                    <div className="flex items-center gap-2 text-green-600">
                        <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">✓</span>
                        Instructions received
                    </div>
                    <div className="flex items-center gap-2 text-gray-800">
                        <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center animate-pulse">
                            <span className="w-2 h-2 bg-black rounded-full" />
                        </span>
                        Generating questions...
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                        <span className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">3</span>
                        Formatting paper
                    </div>
                </div>
            </div>
        );
    }

    if (assignment.status === "FAILED") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
                    <span className="text-red-500 text-2xl">✕</span>
                </div>
                <p className="font-semibold text-lg">Generation Failed</p>
                <p className="text-sm text-gray-400 max-w-sm text-center">
                    Something went wrong while generating your paper. Please try again with different instructions.
                </p>
                <button
                    onClick={() => window.location.href = `/assignments/create?regenerate=${id}`}
                    className="mt-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition active:scale-95"
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
                        onClick={() => window.location.href = `/assignments/create?regenerate=${id}`}
                        className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 active:scale-95 transition flex items-center gap-1"
                    >
                        <RefreshCw size={15} /> <span className="hidden sm:inline">Regenerate</span>
                    </button>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-full border transition active:scale-95 flex items-center gap-1.5 ${isDownloading
                                ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
                                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                    >
                        {isDownloading ? (
                            <>
                                <Loader2 size={15} className="animate-spin" />
                                <span className="hidden sm:inline">Downloading...</span>
                            </>
                        ) : (
                            <>
                                <Download size={15} />
                                <span className="hidden sm:inline">Download</span>
                            </>
                        )}
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
                <div id="paper-content" className="w-[794px] min-h-[1123px] bg-white px-12 py-10 text-black border border-gray-200 shadow-sm rounded-lg">

                    {/* HEADER */}
                    <div className="text-center mb-8">
                        <h2 className="text-xl font-bold uppercase">
                            Delhi Public School
                        </h2>
                    </div>

                    <div className="flex justify-between text-sm mb-6">
                        <span>Time Allowed: 45 minutes</span>
                        <span>Maximum Marks: {sections.reduce((acc: number, section: any) => acc + (section.questions?.reduce((qAcc: number, q: any) => qAcc + (q.marks || 0), 0) || 0), 0)}</span>
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
                                    <div key={qIdx} className="flex gap-2 justify-between items-start">
                                        <div className="flex gap-2 flex-1 min-w-0">
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

                                        {q.marks && (
                                            <span className="font-semibold text-gray-800 text-sm whitespace-nowrap ml-4">
                                                [{q.marks} Mark{q.marks > 1 ? "s" : ""}]
                                            </span>
                                        )}
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