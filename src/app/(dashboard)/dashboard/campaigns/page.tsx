export default function CampaignsPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your market update campaigns.
          </p>
        </div>
        <a
          href="/dashboard/campaigns/new"
          className="rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          New Campaign
        </a>
      </div>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-12 text-center">
        <p className="text-sm text-gray-400">No campaigns yet.</p>
        <a
          href="/dashboard/campaigns/new"
          className="mt-3 inline-block text-sm font-medium text-gray-900 hover:underline"
        >
          Create your first campaign
        </a>
      </div>
    </div>
  );
}
