"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/services/api.config";
import Image from "next/image";

export default function LoginPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        fetch(`${API_BASE_URL}/users`)
            .then((res) => res.json())
            .then((data) => setUsers(data))
            .catch(console.error);
    }, []);

    const handleLogin = () => {
        if (!selectedUser) return;

        localStorage.setItem("user", JSON.stringify(selectedUser));

        if (selectedUser.role === "teacher") {
            router.push("/assignments/create");
        } else {
            router.push("/assignments");
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* LEFT SIDE */}
            <div className="hidden md:flex w-[60%] relative items-center justify-center overflow-hidden">

                {/* BACKGROUND IMAGE */}
                <Image
                    src="/undraw_professor_d7zn.svg"
                    alt="education"
                    fill
                    className="object-contain p-10"
                />

                {/* DARK GRADIENT OVERLAY (IMPORTANT) */}
                <div className="absolute inset-0 bg-linear-to-br from-black/60 via-black/30 to-black/40" />

            </div>


            {/* RIGHT SIDE LOGIN */}
            <div className="w-full md:w-[40%] flex items-center justify-center px-6 py-10 bg-white">

                <div className="w-full max-w-sm flex flex-col items-center text-center">

                    {/* LOGO */}
                    <div className="flex flex-col items-center mb-6">
                        <Image
                            src="/myvedaai_logo.jpeg"
                            alt="VedaAI"
                            width={64}
                            height={64}
                            className="rounded-xl object-cover mb-3"
                        />
                        <h1 className="text-2xl font-semibold text-gray-900">VedaAI</h1>
                        <p className="text-xs text-gray-500 mt-1">
                            Smart Assistance for Education
                        </p>
                    </div>

                    {/* INPUT */}
                    <input
                        value={selectedUser?.email || ""}
                        readOnly
                        placeholder="Select account below"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 mb-4 text-sm focus:ring-2 focus:ring-black outline-none"
                    />

                    {/* DEMO USERS */}
                    <div className="w-full flex flex-col gap-2 mb-6 max-h-44 overflow-auto">
                        {users.map((u) => (
                            <button
                                key={u._id}
                                onClick={() => setSelectedUser(u)}
                                className={`flex justify-between items-center px-4 py-3 rounded-xl border transition text-left ${selectedUser?._id === u._id
                                    ? "border-black  text-white"
                                    : "border-gray-200 hover:bg-gray-50"
                                    }`}
                            >
                                <div>
                                    <p className="text-sm font-medium">{u.name}</p>
                                    <p className="text-xs opacity-70">{u.email}</p>
                                </div>
                                <span className="text-[10px] uppercase font-semibold tracking-wide">
                                    {u.role}
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* BUTTON */}
                    <button
                        onClick={handleLogin}
                        disabled={!selectedUser}
                        className="w-full bg-black text-white py-3 rounded-full font-medium disabled:opacity-40 transition hover:scale-[1.01]"
                    >
                        Login to Dashboard →
                    </button>
                </div>
            </div>
        </div>
    );
}