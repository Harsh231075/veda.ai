import { useState } from "react";
import { useRouter } from "next/navigation";
import { createAssignmentApi } from "@/services/assignment.service";

export const useCreateAssignment = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const submitAssignment = async (dueDate: string, instructions: string, questions: any[], file?: File) => {
        try {
            setLoading(true);
            setError(null);
            
            // 1. Fetch Auth from LocalStorage
            const storedUser = localStorage.getItem("user");
            if (!storedUser) throw new Error("Please mock login first on /login");
            const user = JSON.parse(storedUser);
            const teacherId = user._id;

            // 2. Prepare payload
            const payload = new FormData();
            payload.append("dueDate", dueDate);
            payload.append("instructions", instructions);
            payload.append("questionsConfig", JSON.stringify(questions));
            payload.append("createdBy", teacherId);
            if (file) {
                 payload.append("file", file);
            }

            // 3. Create the assignment
            const data = await createAssignmentApi(payload);
            
            // 4. Redirect to the loading/output view using ID
            if (data?.assignmentId) {
                router.push(`/assignments/output?id=${data.assignmentId}`);
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Failed to create assignment");
        } finally {
            setLoading(false);
        }
    };

    return { submitAssignment, loading, error };
};

import { useEffect } from "react";
import { getAssignmentsByTeacherApi, getAllAssignmentsApi } from "@/services/assignment.service";

export const useGetAssignments = () => {
    const [assignments, setAssignments] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const storedUser = localStorage.getItem("user");
            if (!storedUser) throw new Error("Please mock login first on /login");
            const user = JSON.parse(storedUser);

            let data = [];
            if (user.role === "teacher") {
                data = await getAssignmentsByTeacherApi(user._id);
            } else {
                data = await getAllAssignmentsApi();
            }
            setAssignments(data);
        } catch (err: any) {
            setError(err.message || "Failed to fetch assignments");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    return { assignments, loading, error, refetch: fetchAssignments };
};
