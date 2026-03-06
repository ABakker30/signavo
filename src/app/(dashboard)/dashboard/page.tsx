export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome to Signavo. Manage your brand and campaigns.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/dashboard/brand"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">Brand Setup</h2>
          <p className="mt-1 text-sm text-gray-500">
            Establish your professional brand identity.
          </p>
        </a>
        <a
          href="/dashboard/campaigns/new"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">New Campaign</h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a market update campaign.
          </p>
        </a>
        <a
          href="/dashboard/campaigns"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">My Campaigns</h2>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your published campaigns.
          </p>
        </a>
      </div>
    </div>
  );
}
