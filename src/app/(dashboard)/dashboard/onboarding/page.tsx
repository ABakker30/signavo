export default function OnboardingPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Welcome to Signavo</h1>
      <p className="mt-1 text-sm text-gray-500">
        Let&apos;s set up your brand before creating your first campaign.
      </p>
      <div className="mt-8">
        <a
          href="/dashboard/brand"
          className="inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Set Up Your Brand
        </a>
      </div>
    </div>
  );
}
