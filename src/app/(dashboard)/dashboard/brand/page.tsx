export default function BrandPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Brand Setup</h1>
      <p className="mt-1 text-sm text-gray-500">
        Define how you want to be known in your community.
      </p>
      <form className="mt-8 space-y-6">
        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700">
            Website URL (optional)
          </label>
          <input
            id="website"
            type="url"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="https://yoursite.com"
          />
          <p className="mt-1 text-xs text-gray-400">
            We&apos;ll analyze your site to match your tone and messaging.
          </p>
        </div>

        <div>
          <label htmlFor="positioning" className="block text-sm font-medium text-gray-700">
            How do you want to be known locally?
          </label>
          <input
            id="positioning"
            type="text"
            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
            placeholder="The go-to agent for Norfolk waterfront homes"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Preferred Tone
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["Professional", "Friendly", "Premium", "Direct"].map((tone) => (
              <label
                key={tone}
                className="flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm hover:border-gray-400"
              >
                <input type="radio" name="tone" value={tone.toLowerCase()} className="mr-2" />
                {tone}
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Primary Audience
          </label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {["Buyers", "Sellers", "Relocation", "Investors"].map((audience) => (
              <label
                key={audience}
                className="flex cursor-pointer items-center rounded-lg border border-gray-300 px-4 py-2.5 text-sm hover:border-gray-400"
              >
                <input type="radio" name="audience" value={audience.toLowerCase()} className="mr-2" />
                {audience}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors"
        >
          Save Brand Profile
        </button>
      </form>
    </div>
  );
}
