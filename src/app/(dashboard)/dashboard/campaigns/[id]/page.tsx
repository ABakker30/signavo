export default function CampaignDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Campaign Detail</h1>
      <p className="mt-1 text-sm text-gray-500">Campaign ID: {params.id}</p>
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-8">
        <p className="text-sm text-gray-400">
          Campaign preview and management will appear here.
        </p>
      </div>
    </div>
  );
}
