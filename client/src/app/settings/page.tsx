"use client";

import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Sparkles, Zap, Bot } from "lucide-react";

type Model = "auto" | "gemini" | "claude" | "custom";

export default function SettingsPage() {
  const [model, setModel] = useState<Model>("auto");

  return (
    <DashboardLayout>
      <div className="p-4 sm:p-8 max-w-3xl">
        {/* Header */}
        <h1 className="text-2xl font-semibold mb-8">
          AI Configuration
        </h1>

        {/* Model Selector */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Model Provider
          </p>

          <div className="grid grid-cols-2 sm:flex gap-1.5 bg-gray-100 p-1.5 rounded-2xl w-full sm:w-fit">
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
              className="px-4 py-2 rounded-xl text-sm text-gray-400 flex items-center justify-center gap-1 cursor-not-allowed w-full sm:w-auto hover:bg-white/40 transition"
              title="Coming Soon: Use your own API key"
            >
              Custom 🔒
            </button>
          </div>
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

        {/* Inline Info */}
        <p className="text-xs text-gray-500">
          Multi-model routing enabled for performance and scalability.
        </p>
      </div>

      {/* Divider */}
      <div className="my-10 border-t" />

      {/* Coming Soon Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Coming Soon</h2>

        <div className="space-y-3 text-sm text-gray-600">
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
          <p style={{ color: '#ffffff' }} className="text-sm leading-relaxed tracking-wide">
            Veda AI is built with a scalable multi-model architecture.
            In future updates, users will be able to plug in their own API keys
            and choose between different AI providers for better flexibility and performance.
          </p>
        </div>
      </div>
    </DashboardLayout>
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