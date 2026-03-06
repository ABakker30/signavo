export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
      <p className="mt-1 text-sm text-gray-500">
        Provide a source for your market update.
      </p>
      <form className="mt-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Campaign Source
          </label>
          <p className="mt-1 text-xs text-gray-400">
            Upload a PDF, paste a URL, or describe the update.
          </p>
          <div className="mt-3 space-y-3">
            <input
              type="url"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Paste a URL to an article or market page"
            />
            <textarea
              rows={4}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Or describe the market update..."
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Generate Draft
        </button>
      </form>
    </div>
  );
}
