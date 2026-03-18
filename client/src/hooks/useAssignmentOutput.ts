import { useState, useEffect } from "react";
import { getAssignmentApi, publishAssignmentApi } from "@/services/assignment.service";
import { useRouter } from "next/navigation";

export const useAssignmentOutput = (assignmentId: string | null) => {
    const [assignment, setAssignment] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [publishing, setPublishing] = useState(false);
    const [toast, setToast] = useState<{message: string, type: 'success' | 'error'} | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!assignmentId) return;

        let timer: any;
        
        const fetchAssignment = async () => {
            try {
                const data = await getAssignmentApi(assignmentId);
                setAssignment(data);
                
                if (data.status === "FAILED") {
                    setToast({ message: "Failed to generate paper. Please try recreating.", type: "error" });
                    setLoading(false);
                    return;
                }

                if (data.status === "PENDING" || data.status === "PROCESSING") {
                    timer = setTimeout(fetchAssignment, 2000);
                } else {
                    setLoading(false);
                }
            } catch (err) {
                console.error(err);
                setLoading(false);
                // Retry in 5 seconds on fail
                timer = setTimeout(fetchAssignment, 5000);
            }
        };

        fetchAssignment();

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [assignmentId]);

    const publish = async () => {
        if (!assignmentId) return;
        try {
            setPublishing(true);
            await publishAssignmentApi(assignmentId);
            setToast({ message: "Assignment published successfully!", type: "success" });
            router.push("/assignments/create");
        } catch (err) {
            console.error(err);
            setToast({ message: "Failed to publish assignment", type: "error" });
        } finally {
            setPublishing(false);
        }
    };

    return { assignment, loading, publishing, publish, toast, setToast };
};
