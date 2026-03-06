"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface AccountSettingsFormProps {
  initialData: {
    fullName: string;
    email: string;
    businessName: string;
    city: string;
    region: string;
    postalCode: string;
    websiteUrl: string;
  };
}

export function AccountSettingsForm({ initialData }: AccountSettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [businessName, setBusinessName] = useState(initialData.businessName);
  const [city, setCity] = useState(initialData.city);
  const [region, setRegion] = useState(initialData.region);
  const [postalCode, setPostalCode] = useState(initialData.postalCode);
  const [websiteUrl, setWebsiteUrl] = useState(initialData.websiteUrl);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setSaving(true);

    try {
      const res = await fetch("/api/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          city,
          region,
          postalCode,
          websiteUrl: websiteUrl || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error?.message || "Failed to update account");
        return;
      }

      setSuccess(true);
      router.refresh();
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
          Account updated successfully.
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <p className="mt-1 text-sm text-gray-500">{initialData.email}</p>
        <p className="text-xs text-gray-400">Email cannot be changed here.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <p className="mt-1 text-sm text-gray-500">{initialData.fullName}</p>
        <p className="text-xs text-gray-400">Name is managed through your login profile.</p>
      </div>

      <div>
        <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
          Business Name
        </label>
        <input
          id="businessName"
          type="text"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          required
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-gray-700">
            City
          </label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="Virginia Beach"
          />
        </div>
        <div>
          <label htmlFor="region" className="block text-sm font-medium text-gray-700">
            State / Region
          </label>
          <input
            id="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="VA"
          />
        </div>
      </div>

      <div>
        <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
          Postal Code
        </label>
        <input
          id="postalCode"
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          placeholder="23451"
        />
      </div>

      <div>
        <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
          Website URL
        </label>
        <input
          id="websiteUrl"
          type="url"
          value={websiteUrl}
          onChange={(e) => setWebsiteUrl(e.target.value)}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          placeholder="https://yoursite.com"
        />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
