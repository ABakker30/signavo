export default function LandingPage({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <article>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Market Update
          </h1>
          <p className="mt-2 text-sm text-gray-400">Campaign: {params.slug}</p>
          <div className="mt-8 prose prose-gray">
            <p className="text-gray-600">
              Campaign landing page content will be rendered here.
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}
