"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Sparkles, Zap, Bot } from "lucide-react";

type Model = "auto" | "gemini" | "claude" | "custom";
type Tab = "AI" | "Profile" | "Notifications" | "Advanced";

export default function SettingsPage() {
    const [model, setModel] = useState<Model>("auto");
    const [activeTab, setActiveTab] = useState<Tab>("AI");

    return (
        <DashboardLayout>
            <div className="p-4 sm:p-8 w-full">

                {/* HORIZONTAL TABS */}
                <div className="flex w-full border-b border-gray-200 pb-px mb-8 tracking-wide">
                    <TabButton active={activeTab === "AI"} onClick={() => setActiveTab("AI")} label="AI" />
                    <TabButton active={activeTab === "Profile"} onClick={() => setActiveTab("Profile")} label="Profile" />
                    <TabButton active={activeTab === "Notifications"} onClick={() => setActiveTab("Notifications")} label="Notifications" />
                    <TabButton active={activeTab === "Advanced"} onClick={() => setActiveTab("Advanced")} label="Advanced" />
                </div>

                {/* AI TAB */}
                {activeTab === "AI" && (
                    <div className="space-y-8 animate-in fade-in duration-150">
                        {/* Model Selector */}
                        <div className="mb-8 w-full">
                            <p className="text-sm font-medium text-gray-500 mb-2">
                                Model Provider
                            </p>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 bg-gray-100 p-1.5 rounded-xl w-full">
                                <Segment
                                    label="Auto"
                                    icon={Zap}
                                    active={model === "auto"}
                                    onClick={() => setModel("auto")}
                                />
                                <Segment
                                    label="Gemini"
                                    icon={Sparkles}
                                    active={model === "gemini"}
                                    onClick={() => setModel("gemini")}
                                />
                                <Segment
                                    label="Claude"
                                    icon={Bot}
                                    active={model === "claude"}
                                    onClick={() => setModel("claude")}
                                />

                                {/* Custom (locked) */}
                                <button
                                    className="px-4 py-2 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-1 cursor-not-allowed w-full hover:bg-white/40 transition"
                                    title="Coming Soon: Use your own API key"
                                >
                                    Custom 🔒
                                </button>
                            </div>

                            <p className="text-xs text-gray-400 mt-2 flex items-center gap-1.5">
                                👉 Multi-model routing enabled for performance and scalability.
                            </p>
                        </div>

                        {/* Future API Key (hidden for now, ready later) */}
                        {model === "custom" && (
                            <div className="mb-6">
                                <label className="text-sm text-gray-500">
                                    API Key
                                </label>

                                <div className="mt-2 flex items-center border rounded-lg px-3 py-2 bg-gray-50">
                                    <input
                                        type="text"
                                        placeholder="Enter your API key"
                                        disabled
                                        className="bg-transparent outline-none flex-1 text-sm text-gray-400"
                                    />
                                    <span className="text-gray-400">🔒</span>
                                </div>

                                <p className="text-xs text-gray-400 mt-1">
                                    Supports OpenAI, Gemini, Claude (Coming Soon)
                                </p>
                            </div>
                        )}

                        {/* Divider */}
                        <div className="my-10 border-t" />

                        {/* Coming Soon Section */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Coming Soon
                            </h2>

                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Bring your own API key to remove usage limits</p>
                                <p>• Switch between multiple AI providers dynamically</p>
                                <p>• Smart routing based on performance and cost</p>
                                <p>• Advanced model configuration for custom workflows</p>
                            </div>
                        </div>

                        {/* Mini Info */}
                        <div className="mt-8 p-5 rounded-2xl bg-black text-white border-2 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.07)] flex items-start gap-4">
                            <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 mt-0.5">
                                <Sparkles className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <p style={{ color: '#ffffff' }} className="text-sm text-white leading-relaxed tracking-wide">
                                    Veda AI is built with a scalable multi-model architecture.
                                    In future updates, users will be able to plug in their own API keys
                                    and choose between different AI providers for better flexibility and performance.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* PROFILE TAB */}
                {activeTab === "Profile" && (
                    <div className="space-y-6 animate-in fade-in duration-150">
                        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
                            <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 font-semibold text-xl border border-indigo-100/30">
                                T
                            </div>
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">Teacher Profile</h3>
                                <p className="text-xs text-gray-500">Manage your personal account and setup configurations.</p>
                            </div>
                        </div>

                        <div className="w-full space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-tight">Name</label>
                                <input type="text" value="Teacher Profile" readOnly className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 cursor-not-allowed outline-none font-medium" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-tight">Email</label>
                                <input type="text" value="teacher@veda.ai" readOnly className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-700 cursor-not-allowed outline-none font-medium" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-tight">Account Role</label>
                                <input type="text" value="System Administrator" readOnly className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-500 cursor-not-allowed outline-none font-medium" />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-10 border-t" />

                        {/* Coming Soon Section */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Coming Soon
                            </h2>

                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Upload custom avatars and profile banners</p>
                                <p>• Manage multiple organizational roles and permissions</p>
                                <p>• Detailed personal usage statistics and history</p>
                            </div>
                        </div>

                        {/* Mini Info */}
                        <div className="mt-8 p-5 rounded-2xl bg-black text-white border-2 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.07)] flex items-start gap-4">
                            <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 mt-0.5">
                                <Sparkles className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <p style={{ color: '#ffffff' }} className="text-sm text-white leading-relaxed tracking-wide">
                                    Profile management is part of our upcoming architecture overhaul.
                                    In future updates, users will be able to fully manage and customize their personal account details, avatars, and role permissions.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* NOTIFICATIONS TAB */}
                {activeTab === "Notifications" && (
                    <div className="space-y-6 animate-in fade-in duration-150 w-full">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-base font-semibold text-gray-900">Email Preferences</h3>
                            <p className="text-xs text-gray-500">Configure how you receive summary updates and alerts setup.</p>
                        </div>

                        <div className="space-y-3">
                            <ToggleItem label="Assignment completion alerts" description="Get notified once paper generation finishes layout sets." />
                            <ToggleItem label="Weekly digest summary" description="System usage and throughput overview reports layout." />
                            <ToggleItem label="Account security alerts" description="Login updates and secure parameters alerts verification layout." defaultChecked />
                        </div>

                        {/* Divider */}
                        <div className="my-10 border-t" />

                        {/* Coming Soon Section */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Coming Soon
                            </h2>

                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Granular push and SMS notification routing</p>
                                <p>• Webhook integrations for external analytics dashboards</p>
                                <p>• Scheduled digest emails for weekly organizational reports</p>
                            </div>
                        </div>

                        {/* Mini Info */}
                        <div className="mt-8 p-5 rounded-2xl bg-black text-white border-2 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.07)] flex items-start gap-4">
                            <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 mt-0.5">
                                <Sparkles className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <p style={{ color: '#ffffff' }} className="text-sm text-white leading-relaxed tracking-wide">
                                    Advanced notification routing is built into our scalable architecture.
                                    In future updates, users will be able to configure granular email digests, alerts, and real-time webhook integrations.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADVANCED TAB */}
                {activeTab === "Advanced" && (
                    <div className="space-y-6 animate-in fade-in duration-150 w-full">
                        <div className="border-b border-gray-100 pb-4">
                            <h3 className="text-base font-semibold text-gray-900">Advanced Controls</h3>
                            <p className="text-xs text-gray-500">Fine-tune system cache and technical configuration parameters setup.</p>
                        </div>

                        <div className="space-y-3">
                            <div className="p-4 border border-gray-200 rounded-2xl bg-gray-50/50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900">Clear Workspace Cache</h4>
                                    <p className="text-xs text-gray-400">Clears locally loaded assignment datasets buffers layout.</p>
                                </div>
                                <button className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-xs font-medium text-slate-700 shadow-sm transition">Clear</button>
                            </div>

                            <div className="p-4 border border-gray-200 opacity-60 rounded-2xl bg-gray-50/50 flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-900 flex items-center gap-1.5">Data Portability 🔒</h4>
                                    <p className="text-xs text-gray-400">Download offline paper generation history datasets sync buffers.</p>
                                </div>
                                <button disabled className="px-3 py-1.5 rounded-lg border border-gray-200 bg-gray-100 text-xs font-medium text-slate-400 cursor-not-allowed">Export</button>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="my-10 border-t" />

                        {/* Coming Soon Section */}
                        <div className="space-y-4">
                            <h2 className="text-sm font-semibold flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-indigo-500" />
                                Coming Soon
                            </h2>

                            <div className="space-y-2 text-sm text-gray-600">
                                <p>• Complete workspace data exports and cloud backups</p>
                                <p>• System-level cache tuning for massive data ingestion</p>
                                <p>• Automated organizational data compliances and syncs</p>
                            </div>
                        </div>

                        {/* Mini Info */}
                        <div className="mt-8 p-5 rounded-2xl bg-black text-white border-2 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.07)] flex items-start gap-4">
                            <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20 mt-0.5">
                                <Sparkles className="w-4 h-4 text-red-400" />
                            </div>
                            <div>
                                <p style={{ color: '#ffffff' }} className="text-sm text-white leading-relaxed tracking-wide">
                                    Advanced system controls represent our premium enterprise tier functionality.
                                    In future updates, users will gain access to direct system-level configuration, cache tuning, and automated data exports.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}

/* Tab Button */
function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 flex items-center justify-center px-3 py-2 text-sm font-medium border-b-2 transition-all -mb-px outline-none ${active
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
        >
            {label}
        </button>
    );
}

/* Segment Button */
function Segment({
    label,
    active,
    icon: Icon,
    onClick,
}: {
    label: string;
    active?: boolean;
    icon: any;
    onClick?: () => void;
}) {
    return (
        <button
            onClick={onClick}
            className={`px-4 py-2 rounded-xl text-sm transition flex items-center justify-center gap-1.5 w-full sm:w-auto ${active
                ? "bg-white shadow-sm font-medium text-slate-900"
                : "text-gray-600 hover:bg-white/80"
                }`}
        >
            <Icon size={14} className={active ? "text-indigo-500" : "text-gray-400"} />
            {label}
        </button>
    );
}

/* Toggle Switch Component */
function ToggleItem({ label, description, defaultChecked = false }: { label: string; description: string; defaultChecked?: boolean }) {
    const [checked, setChecked] = useState(defaultChecked);

    return (
        <div className="flex items-start justify-between p-3 border border-gray-100/50 hover:border-gray-200 rounded-xl transition cursor-pointer bg-gray-50/20" onClick={() => setChecked(!checked)}>
            <div className="space-y-0.5">
                <h4 className="text-sm font-medium text-gray-800">{label}</h4>
                <p className="text-xs text-gray-400">{description}</p>
            </div>
            <div className={`h-5 w-9 rounded-full p-0.5 transition-colors duration-200 flex-shrink-0 mt-0.5 ${checked ? "bg-indigo-600" : "bg-gray-200"}`}>
                <div className={`h-4 w-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
            </div>
        </div>
    );
}