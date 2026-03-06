export default function SupportPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Support</h1>
      <p className="mt-1 text-sm text-gray-500">
        Get help with your account or campaigns.
      </p>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 px-4 py-3 text-sm text-gray-600">
            Hi! I&apos;m your Signavo assistant. How can I help you today?
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
              placeholder="Ask a question..."
            />
            <button
              type="button"
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
