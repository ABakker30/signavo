"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface CampaignActionsProps {
  campaignId: string;
  status: string;
}

export function CampaignActions({ campaignId, status }: CampaignActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refinePrompt, setRefinePrompt] = useState("");

  async function handleRefine() {
    if (!refinePrompt.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/refine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: refinePrompt }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "Refinement failed");
        return;
      }

      setRefinePrompt("");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confirm: true }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Publishing failed");
        return;
      }

      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  if (status === "published") {
    return (
      <div className="mt-8 rounded-xl border border-green-200 bg-green-50 p-5">
        <p className="text-sm font-medium text-green-800">
          This campaign is published and live.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="text-sm font-medium text-gray-900">Refine Draft</h3>
        <p className="mt-1 text-xs text-gray-400">
          Tell us how to adjust the draft.
        </p>
        <div className="mt-3 flex gap-2">
          <input
            type="text"
            value={refinePrompt}
            onChange={(e) => setRefinePrompt(e.target.value)}
            placeholder="Make it more seller-focused..."
            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <button
            onClick={handleRefine}
            disabled={loading || !refinePrompt.trim()}
            className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 transition-colors disabled:opacity-50"
          >
            Refine
          </button>
        </div>
      </div>

      <button
        onClick={handlePublish}
        disabled={loading}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {loading ? "Publishing..." : "Publish Campaign"}
      </button>
    </div>
  );
}
