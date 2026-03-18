import { API_BASE_URL } from "./api.config";

export const createAssignmentApi = async (payload: any) => {
    const isFormData = payload instanceof FormData;
    const res = await fetch(`${API_BASE_URL}/assignments`, {
        method: "POST",
        headers: isFormData ? {} : { "Content-Type": "application/json" },
        body: isFormData ? payload : JSON.stringify(payload)
    });
    
    if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create assignment");
    }
    
    return res.json();
};

export const getAssignmentApi = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/assignments/${id}`);
    if (!res.ok) throw new Error("Failed to load assignment");
    return res.json();
};

export const publishAssignmentApi = async (id: string) => {
    const res = await fetch(`${API_BASE_URL}/assignments/${id}/publish`, { method: "PUT" });
    if (!res.ok) throw new Error("Failed to publish assignment");
    return res.json();
};
