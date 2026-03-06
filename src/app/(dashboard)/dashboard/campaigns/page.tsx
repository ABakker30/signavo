import { createClient, createAdminClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";

export default async function CampaignsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: account } = await admin
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: campaigns } = await admin
    .from("campaigns")
    .select("id, title, status, created_at, updated_at, landing_page_slug")
    .eq("account_id", account?.id || "")
    .order("created_at", { ascending: false });

  const list = campaigns || [];

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            Your market update campaigns.
          </p>
        </div>
        <a
          href="/dashboard/campaigns/new"
          className="self-start rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-colors text-center"
        >
          New Campaign
        </a>
      </div>

      {list.length === 0 ? (
        <div className="mt-6 sm:mt-8 rounded-xl border border-gray-200 bg-white p-8 sm:p-12 text-center">
          <p className="text-sm text-gray-400">No campaigns yet.</p>
          <a
            href="/dashboard/campaigns/new"
            className="mt-3 inline-block text-sm font-medium text-gray-900 hover:underline"
          >
            Create your first campaign
          </a>
        </div>
      ) : (
        <div className="mt-6 sm:mt-8 space-y-3">
          {list.map((c) => (
            <a
              key={c.id}
              href={`/dashboard/campaigns/${c.id}`}
              className="block rounded-xl border border-gray-200 bg-white p-5 hover:border-gray-300 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-gray-900">
                  {c.title || "Untitled Campaign"}
                </h2>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  c.status === "published"
                    ? "bg-green-100 text-green-700"
                    : c.status === "draft"
                    ? "bg-gray-100 text-gray-600"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {c.status}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Created {new Date(c.created_at).toLocaleDateString()}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
