"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { COUNTRIES, LANGUAGES } from "@/lib/data/countries";

interface AccountSettingsFormProps {
  initialData: {
    fullName: string;
    email: string;
    businessName: string;
    industryType: string;
    streetAddress: string;
    addressLine2: string;
    city: string;
    region: string;
    postalCode: string;
    country: string;
    websiteUrl: string;
    businessPhone: string;
    businessEmail: string;
    licenseNumber: string;
    yearsInBusiness: string;
    tagline: string;
    uiLanguage: string;
    campaignLanguage: string;
  };
}

const INDUSTRY_OPTIONS = [
  { value: "REAL_ESTATE", label: "Real Estate" },
  { value: "INSURANCE", label: "Insurance" },
  { value: "MORTGAGE", label: "Mortgage / Lending" },
  { value: "FINANCIAL_SERVICES", label: "Financial Services" },
  { value: "LEGAL", label: "Legal" },
  { value: "CONSULTING", label: "Consulting" },
  { value: "HEALTHCARE", label: "Healthcare" },
  { value: "OTHER", label: "Other" },
];

export function AccountSettingsForm({ initialData }: AccountSettingsFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [businessName, setBusinessName] = useState(initialData.businessName);
  const [industryType, setIndustryType] = useState(initialData.industryType);
  const [streetAddress, setStreetAddress] = useState(initialData.streetAddress);
  const [addressLine2, setAddressLine2] = useState(initialData.addressLine2);
  const [city, setCity] = useState(initialData.city);
  const [region, setRegion] = useState(initialData.region);
  const [postalCode, setPostalCode] = useState(initialData.postalCode);
  const [country, setCountry] = useState(initialData.country);
  const [websiteUrl, setWebsiteUrl] = useState(initialData.websiteUrl);
  const [businessPhone, setBusinessPhone] = useState(initialData.businessPhone);
  const [businessEmail, setBusinessEmail] = useState(initialData.businessEmail);
  const [licenseNumber, setLicenseNumber] = useState(initialData.licenseNumber);
  const [yearsInBusiness, setYearsInBusiness] = useState(initialData.yearsInBusiness);
  const [tagline, setTagline] = useState(initialData.tagline);
  const [uiLanguage, setUiLanguage] = useState(initialData.uiLanguage);
  const [campaignLanguage, setCampaignLanguage] = useState(initialData.campaignLanguage);

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
          industryType,
          streetAddress: streetAddress || null,
          addressLine2: addressLine2 || null,
          city: city || null,
          region: region || null,
          postalCode: postalCode || null,
          country,
          websiteUrl: websiteUrl || null,
          businessPhone: businessPhone || null,
          businessEmail: businessEmail || null,
          licenseNumber: licenseNumber || null,
          yearsInBusiness: yearsInBusiness ? parseInt(yearsInBusiness) : null,
          tagline: tagline || null,
          uiLanguage,
          campaignLanguage,
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
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
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

      {/* Login Info (read-only) */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Login Info</h2>
        <div className="mt-4 space-y-3">
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
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Business Identity */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Business Identity</h2>
        <div className="mt-4 space-y-4">
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

          <div>
            <label htmlFor="industryType" className="block text-sm font-medium text-gray-700">
              Industry / Line of Business
            </label>
            <select
              id="industryType"
              value={industryType}
              onChange={(e) => setIndustryType(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {INDUSTRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="tagline" className="block text-sm font-medium text-gray-700">
              Tagline / Slogan
            </label>
            <input
              id="tagline"
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Your trusted local expert"
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
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Contact Info */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Contact Info</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="businessPhone" className="block text-sm font-medium text-gray-700">
              Business Phone
            </label>
            <input
              id="businessPhone"
              type="tel"
              value={businessPhone}
              onChange={(e) => setBusinessPhone(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="+1 (757) 555-0100"
            />
          </div>

          <div>
            <label htmlFor="businessEmail" className="block text-sm font-medium text-gray-700">
              Business Email
            </label>
            <input
              id="businessEmail"
              type="email"
              value={businessEmail}
              onChange={(e) => setBusinessEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="contact@yourbusiness.com"
            />
            <p className="mt-1 text-xs text-gray-400">
              Public-facing email, separate from your login email.
            </p>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Address */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Address</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="streetAddress" className="block text-sm font-medium text-gray-700">
              Street Address
            </label>
            <input
              id="streetAddress"
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="123 Main St"
            />
          </div>

          <div>
            <label htmlFor="addressLine2" className="block text-sm font-medium text-gray-700">
              Address Line 2
            </label>
            <input
              id="addressLine2"
              type="text"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Suite 200"
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

          <div className="grid grid-cols-2 gap-4">
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
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <select
                id="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Professional Details */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Professional Details</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700">
              License Number
            </label>
            <input
              id="licenseNumber"
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="RE-12345"
            />
            <p className="mt-1 text-xs text-gray-400">
              Your professional license or registration number, if applicable.
            </p>
          </div>

          <div>
            <label htmlFor="yearsInBusiness" className="block text-sm font-medium text-gray-700">
              Years in Business
            </label>
            <input
              id="yearsInBusiness"
              type="number"
              min="0"
              max="100"
              value={yearsInBusiness}
              onChange={(e) => setYearsInBusiness(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="5"
            />
          </div>
        </div>
      </section>

      <hr className="border-gray-200" />

      {/* Language Preferences */}
      <section>
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">Language Preferences</h2>
        <div className="mt-4 space-y-4">
          <div>
            <label htmlFor="uiLanguage" className="block text-sm font-medium text-gray-700">
              Interface Language
            </label>
            <select
              id="uiLanguage"
              value={uiLanguage}
              onChange={(e) => setUiLanguage(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              The language the dashboard is displayed in.
            </p>
          </div>

          <div>
            <label htmlFor="campaignLanguage" className="block text-sm font-medium text-gray-700">
              Default Campaign Language
            </label>
            <select
              id="campaignLanguage"
              value={campaignLanguage}
              onChange={(e) => setCampaignLanguage(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            >
              {LANGUAGES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              The language your campaigns are generated in.
            </p>
          </div>
        </div>
      </section>

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
