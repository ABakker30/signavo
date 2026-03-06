import { createClient, createAdminClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const admin = createAdminClient();
  const name = user.user_metadata?.full_name || "there";

  const { data: account } = await admin
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  let brandStatus = "not_started";
  let campaignCount = 0;

  if (account) {
    const { data: brand } = await admin
      .from("brand_profiles")
      .select("status")
      .eq("account_id", account.id)
      .single();

    brandStatus = brand?.status || "not_started";

    const { count } = await admin
      .from("campaigns")
      .select("id", { count: "exact", head: true })
      .eq("account_id", account.id);

    campaignCount = count || 0;
  }

  const brandFinalized = brandStatus === "finalized";

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">
        Welcome back, {name}
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        Ready to stay visible this week?
      </p>

      {!brandFinalized && (
        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5">
          <h2 className="font-semibold text-amber-900">Complete your brand setup</h2>
          <p className="mt-1 text-sm text-amber-700">
            Before you can create campaigns, you need to set up your brand profile.
          </p>
          <a
            href="/dashboard/brand"
            className="mt-3 inline-block rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700 transition-colors"
          >
            Set Up Brand
          </a>
        </div>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href="/dashboard/brand"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-gray-300 transition-colors"
        >
          <h2 className="font-semibold text-gray-900">Brand Setup</h2>
          <p className="mt-1 text-sm text-gray-500">
            {brandFinalized
              ? "Your brand is set up. Click to edit."
              : "Establish your professional brand identity."}
          </p>
          <span className={`mt-3 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${
            brandFinalized
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}>
            {brandFinalized ? "Complete" : "Not started"}
          </span>
        </a>
        <a
          href={brandFinalized ? "/dashboard/campaigns/new" : "#"}
          className={`rounded-xl border border-gray-200 bg-white p-6 transition-colors ${
            brandFinalized ? "hover:border-gray-300" : "opacity-50 cursor-not-allowed"
          }`}
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
            {campaignCount > 0
              ? `${campaignCount} campaign${campaignCount === 1 ? "" : "s"}`
              : "No campaigns yet"}
          </p>
        </a>
      </div>
    </div>
  );
}
