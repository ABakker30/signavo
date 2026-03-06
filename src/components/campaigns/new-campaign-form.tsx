"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface ExtractedSlide {
  index: number;
  headline: string;
  body: string;
}

interface EventDetails {
  isEvent: boolean;
  venue: string | null;
  address: string | null;
  date: string | null;
  time: string | null;
  eventType: string | null;
  ticketInfo: string | null;
}

interface ExtractedData {
  contentType: string;
  topic: string;
  keyMessage: string;
  targetAudience: string;
  keyPoints: string[];
  suggestedTitle: string;
  eventDetails: EventDetails;
  suggestedSlides: ExtractedSlide[];
  imageMood: string;
}

type Step = "input" | "extracting" | "review" | "generating";

export function NewCampaignForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState<string | null>(null);

  // Step 1: Input
  const [sourceUrl, setSourceUrl] = useState("");
  const [rawText, setRawText] = useState("");

  // Step 2: Extracted data (editable)
  const [extracted, setExtracted] = useState<ExtractedData | null>(null);
  const [contentType, setContentType] = useState("");
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");
  const [keyMessage, setKeyMessage] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [slides, setSlides] = useState<ExtractedSlide[]>([]);
  const [imageMood, setImageMood] = useState("");

  // Event details
  const [eventVenue, setEventVenue] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventType, setEventType] = useState("");
  const [ticketInfo, setTicketInfo] = useState("");

  async function handleExtract() {
    setError(null);

    if (!sourceUrl && !rawText) {
      setError("Provide a URL or describe the market update.");
      return;
    }

    // If user only typed text (no URL), skip extraction and go straight to generate
    if (!sourceUrl && rawText) {
      setStep("generating");
      await handleDirectGenerate();
      return;
    }

    setStep("extracting");

    try {
      const res = await fetch("/api/campaigns/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to extract content");
        setStep("input");
        return;
      }

      const ext = data.data as ExtractedData;
      setExtracted(ext);
      setContentType(ext.contentType || "other");
      setTitle(ext.suggestedTitle);
      setTopic(ext.topic);
      setKeyMessage(ext.keyMessage);
      setTargetAudience(ext.targetAudience);
      setSlides(ext.suggestedSlides);
      setImageMood(ext.imageMood);

      // Populate event details if present
      if (ext.eventDetails?.isEvent) {
        setEventVenue(ext.eventDetails.venue || "");
        setEventAddress(ext.eventDetails.address || "");
        setEventDate(ext.eventDetails.date || "");
        setEventTime(ext.eventDetails.time || "");
        setEventType(ext.eventDetails.eventType || "");
        setTicketInfo(ext.eventDetails.ticketInfo || "");
      }
      setStep("review");
    } catch {
      setError("Network error. Please try again.");
      setStep("input");
    }
  }

  async function handleDirectGenerate() {
    try {
      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "Market Update",
          inputType: "text",
          rawText,
          sourceUrl: null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to create campaign");
        setStep("input");
        return;
      }

      const campaignId = data.data.id;
      await fetch(`/api/campaigns/${campaignId}/generate-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerate: false }),
      });

      router.push(`/dashboard/campaigns/${campaignId}`);
    } catch {
      setError("Network error. Please try again.");
      setStep("input");
    }
  }

  async function handleGenerateFromExtracted() {
    setError(null);
    setStep("generating");

    try {
      // Build enriched input text from the refined extraction
      const eventBlock = eventVenue
        ? [
            "",
            "Event details:",
            `Content type: ${contentType}`,
            eventVenue ? `Venue: ${eventVenue}` : "",
            eventAddress ? `Address: ${eventAddress}` : "",
            eventDate ? `Date: ${eventDate}` : "",
            eventTime ? `Time: ${eventTime}` : "",
            eventType ? `Event type: ${eventType}` : "",
            ticketInfo ? `Entry/tickets: ${ticketInfo}` : "",
          ].filter(Boolean).join("\n")
        : "";

      const enrichedInput = [
        `Topic: ${topic}`,
        `Key message: ${keyMessage}`,
        `Target audience: ${targetAudience}`,
        `Image mood: ${imageMood}`,
        eventBlock,
        "",
        "Suggested slides:",
        ...slides.map(
          (s) => `Slide ${s.index}: ${s.headline} — ${s.body}`
        ),
        "",
        extracted?.keyPoints?.length
          ? `Key points: ${extracted.keyPoints.join("; ")}`
          : "",
      ].join("\n");

      const res = await fetch("/api/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || "Market Update",
          inputType: "url",
          rawText: enrichedInput,
          sourceUrl: sourceUrl || null,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error?.message || "Failed to create campaign");
        setStep("review");
        return;
      }

      const campaignId = data.data.id;
      await fetch(`/api/campaigns/${campaignId}/generate-draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ regenerate: false }),
      });

      router.push(`/dashboard/campaigns/${campaignId}`);
    } catch {
      setError("Network error. Please try again.");
      setStep("review");
    }
  }

  function updateSlide(index: number, field: "headline" | "body", value: string) {
    setSlides((prev) =>
      prev.map((s) => (s.index === index ? { ...s, [field]: value } : s))
    );
  }

  // Step 1: Input
  if (step === "input") {
    return (
      <div className="mt-6 sm:mt-8 space-y-6">
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Campaign Source
          </label>
          <p className="mt-1 text-xs text-gray-400">
            Paste a URL to an article, listing, or market page — AI will extract the key info.
          </p>
          <input
            type="url"
            value={sourceUrl}
            onChange={(e) => setSourceUrl(e.target.value)}
            className="mt-3 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="https://example.com/market-report"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Describe It
          </label>
          <textarea
            rows={4}
            value={rawText}
            onChange={(e) => setRawText(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Describe the market update, event, or topic..."
          />
        </div>

        <button
          onClick={handleExtract}
          disabled={!sourceUrl && !rawText}
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          {sourceUrl ? "Extract & Preview" : "Generate Draft"}
        </button>
      </div>
    );
  }

  // Step 2: Extracting
  if (step === "extracting") {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <p className="text-sm text-gray-500">Analyzing page content...</p>
        <p className="text-xs text-gray-400">This may take 15-30 seconds</p>
      </div>
    );
  }

  // Step 3: Generating
  if (step === "generating") {
    return (
      <div className="mt-8 flex flex-col items-center gap-4 py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900" />
        <p className="text-sm text-gray-500">Generating your campaign...</p>
      </div>
    );
  }

  // Step 4: Review & Refine
  return (
    <div className="mt-6 sm:mt-8 space-y-6">
      {error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
        <div className="flex items-center gap-2">
          <span>Content extracted!</span>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            contentType === "event"
              ? "bg-purple-100 text-purple-700"
              : contentType === "listing"
              ? "bg-blue-100 text-blue-700"
              : contentType === "promotion"
              ? "bg-amber-100 text-amber-700"
              : "bg-gray-100 text-gray-700"
          }`}>
            {contentType}
          </span>
        </div>
        <p className="mt-0.5 text-xs text-green-600">Review and refine before generating.</p>
      </div>

      {(contentType === "event" || eventVenue) && (
        <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 space-y-3">
          <h3 className="text-sm font-semibold text-purple-900">Event Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-purple-700">Venue</label>
              <input
                type="text"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                className="mt-1 block w-full rounded-md border border-purple-200 bg-white px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Venue name"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-700">Event Type</label>
              <input
                type="text"
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-purple-200 bg-white px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="celebration, open house, etc."
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-purple-700">Address</label>
              <input
                type="text"
                value={eventAddress}
                onChange={(e) => setEventAddress(e.target.value)}
                className="mt-1 block w-full rounded-md border border-purple-200 bg-white px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Full address"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-700">Date</label>
              <input
                type="text"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="mt-1 block w-full rounded-md border border-purple-200 bg-white px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Friday, March 7, 2026"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-purple-700">Time</label>
              <input
                type="text"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                className="mt-1 block w-full rounded-md border border-purple-200 bg-white px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="7:00 PM - 11:00 PM"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-purple-700">Entry / Tickets</label>
              <input
                type="text"
                value={ticketInfo}
                onChange={(e) => setTicketInfo(e.target.value)}
                className="mt-1 block w-full rounded-md border border-purple-200 bg-white px-3 py-1.5 text-sm focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                placeholder="Free entry, tickets at door, etc."
              />
            </div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Campaign Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Topic</label>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Key Message</label>
        <textarea
          rows={2}
          value={keyMessage}
          onChange={(e) => setKeyMessage(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Target Audience</label>
        <input
          type="text"
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Image Mood</label>
        <p className="mt-0.5 text-xs text-gray-400">Describes the AI-generated background image style</p>
        <input
          type="text"
          value={imageMood}
          onChange={(e) => setImageMood(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Suggested Slides
        </label>
        <div className="space-y-4">
          {slides.map((slide) => (
            <div
              key={slide.index}
              className="rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                  {slide.index}
                </span>
                <span className="text-xs text-gray-400">
                  {slide.index === 1
                    ? "Hook"
                    : slide.index === 5
                    ? "Call to Action"
                    : "Key Insight"}
                </span>
              </div>
              <input
                type="text"
                value={slide.headline}
                onChange={(e) => updateSlide(slide.index, "headline", e.target.value)}
                className="block w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm font-semibold focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Headline"
              />
              <textarea
                rows={2}
                value={slide.body}
                onChange={(e) => updateSlide(slide.index, "body", e.target.value)}
                className="mt-2 block w-full rounded-md border border-gray-200 px-3 py-1.5 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                placeholder="Body text"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => setStep("input")}
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          ← Back
        </button>
        <button
          onClick={handleGenerateFromExtracted}
          className="flex-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Generate Campaign
        </button>
      </div>
    </div>
  );
}
