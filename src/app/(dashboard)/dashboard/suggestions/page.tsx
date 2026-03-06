export default function SuggestionsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Suggestions</h1>
      <p className="mt-1 text-sm text-gray-500">
        Content ideas and campaign suggestions.
      </p>
      <div className="mt-8 space-y-4">
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="text-sm font-medium text-gray-900">
            Weekly Market Update
          </p>
          <p className="mt-1 text-sm text-gray-500">
            It&apos;s been a week since your last update. Consider publishing a
            new market report for your area.
          </p>
          <a
            href="/dashboard/campaigns/new"
            className="mt-3 inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Create campaign
          </a>
        </div>
      </div>
    </div>
  );
}
