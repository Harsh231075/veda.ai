"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api.config";

export default function LoginPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/users`)
            .then(res => res.json())
            .then(data => {
                setUsers(data);
                if (data.length > 0) setSelectedUserId(data[0]._id);
            });
    }, []);

    const handleLogin = () => {
        const user = users.find(u => u._id === selectedUserId);
        if (!user) return;

        // Only allow teacher accounts into the dashboard
        if (user.role !== "teacher") {
            alert("Only teacher accounts can access the dashboard in this demo.");
            return;
        }

        localStorage.setItem("user", JSON.stringify(user));
        router.push("/assignments/create");
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm max-w-sm w-full">
                <h1 className="text-2xl font-bold mb-6 text-center">VedaAI Login</h1>
                <p className="text-sm text-gray-500 mb-4 text-center">Select a demo account to mimic authentication.</p>

                <select
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full border rounded-xl px-4 py-3 mb-6 bg-gray-50"
                >
                    {users.map(u => (
                        <option key={u._id} value={u._id}>
                            {u.name} ({u.role})
                        </option>
                    ))}
                </select>

                <button
                    onClick={handleLogin}
                    className="w-full bg-black text-white rounded-full py-3 font-medium transition active:scale-95"
                >
                    Login to Dashboard
                </button>
            </div>
        </div>
    );
}
