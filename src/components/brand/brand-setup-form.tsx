"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface BrandSetupFormProps {
  initialData?: {
    websiteUrl?: string;
    positioning?: string;
    knownFor?: string;
    tone?: string;
    audienceFocus?: string;
  };
}

const KNOWN_FOR_OPTIONS = [
  { value: "TRUSTED_ADVISOR", label: "Trusted advisor" },
  { value: "MARKET_EXPERT", label: "Market expert" },
  { value: "NEIGHBORHOOD_SPECIALIST", label: "Neighborhood specialist" },
  { value: "RESULTS_DRIVEN", label: "Results-driven seller" },
  { value: "RELATIONSHIP_BUILDER", label: "Relationship builder" },
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "friendly", label: "Friendly" },
  { value: "premium", label: "Premium" },
  { value: "direct", label: "Direct" },
];

const AUDIENCE_OPTIONS = [
  { value: "buyers", label: "Buyers" },
  { value: "sellers", label: "Sellers" },
  { value: "military_relocation", label: "Military relocation" },
  { value: "investors", label: "Investors" },
];

export function BrandSetupForm({ initialData }: BrandSetupFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const [websiteUrl, setWebsiteUrl] = useState(initialData?.websiteUrl || "");
  const [positioning, setPositioning] = useState(initialData?.positioning || "");
  const [knownFor, setKnownFor] = useState(initialData?.knownFor || "");
  const [tone, setTone] = useState(initialData?.tone || "");
  const [audienceFocus, setAudienceFocus] = useState(initialData?.audienceFocus || "");

  async function handleAnalyze() {
    if (!websiteUrl) {
      setError("Enter a website URL to analyze.");
      return;
    }
    setError(null);
    setAnalysisResult(null);
    setAnalyzing(true);

    try {
      const res = await fetch("/api/brand/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ websiteUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Website analysis failed");
        return;
      }

      const d = data.data;

      // Auto-populate fields from analysis
      if (d.positioningSuggestion && !positioning) setPositioning(d.positioningSuggestion);
      if (d.brandToneHint && !tone) setTone(d.brandToneHint.toLowerCase());
      if (d.knownForHint && !knownFor) setKnownFor(d.knownForHint);
      if (d.audienceHint && !audienceFocus) {
        const hint = d.audienceHint.toLowerCase();
        if (hint.includes("buyer")) setAudienceFocus("buyers");
        else if (hint.includes("seller")) setAudienceFocus("sellers");
        else if (hint.includes("relocation") || hint.includes("military")) setAudienceFocus("military_relocation");
        else if (hint.includes("invest")) setAudienceFocus("investors");
      }

      setAnalysisResult(
        `Analyzed ${d.pagesAnalyzed} page(s). Found: "${d.tagline || d.siteTitle}". ` +
        `Key phrases: ${(d.keyPhrases || []).slice(0, 3).join(", ")}.`
      );
    } catch {
      setError("Network error during analysis. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!tone || !audienceFocus) {
      setError("Please select a tone and audience focus.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/brand/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: websiteUrl || null,
          positioning: positioning || null,
          knownFor: knownFor || null,
          tone,
          audienceFocus,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Something went wrong");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
          Brand profile saved. Redirecting to dashboard...
        </div>
      )}

      <div>
        <label htmlFor="website" className="block text-sm font-medium text-gray-700">
          Website URL (optional)
        </label>
        <input
          id="website"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          placeholder="https://yoursite.com"
        />
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={handleAnalyze}
            disabled={analyzing || !websiteUrl}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {analyzing ? "Analyzing..." : "Analyze Website"}
          </button>
          {analyzing && (
            <span className="self-center text-xs text-gray-400">This may take 15-30 seconds</span>
          )}
        </div>
        {analysisResult && (
          <div className="mt-2 rounded-lg bg-blue-50 px-4 py-3 text-sm text-blue-700">
            {analysisResult}
          </div>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          How do you want to be known locally?
        </label>
        <div className="mt-2 grid grid-cols-1 gap-2">
          {KNOWN_FOR_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                knownFor === opt.value
                  ? "border-gray-900 bg-gray-50 font-medium"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="knownFor"
                value={opt.value}
                checked={knownFor === opt.value}
                onChange={(e) => setKnownFor(e.target.value)}
                className="mr-3"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="positioning" className="block text-sm font-medium text-gray-700">
          Your positioning statement (optional)
        </label>
        <input
          id="positioning"
          type="text"
          value={positioning}
          onChange={(e) => setPositioning(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          placeholder="Helping Hampton Roads families navigate the market with confidence"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          How should your tone feel?
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {TONE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                tone === opt.value
                  ? "border-gray-900 bg-gray-50 font-medium"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="tone"
                value={opt.value}
                checked={tone === opt.value}
                onChange={(e) => setTone(e.target.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Who do you work with most?
        </label>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {AUDIENCE_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                audienceFocus === opt.value
                  ? "border-gray-900 bg-gray-50 font-medium"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                name="audience"
                value={opt.value}
                checked={audienceFocus === opt.value}
                onChange={(e) => setAudienceFocus(e.target.value)}
                className="mr-2"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Brand Profile"}
      </button>
    </form>
  );
}
