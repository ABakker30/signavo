import { createClient, createAdminClient } from "@/lib/db/supabase-server";
import { redirect, notFound } from "next/navigation";
import { CampaignActions } from "@/components/campaigns/campaign-actions";

export default async function CampaignDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: account } = await admin
    .from("accounts")
    .select("id")
    .eq("user_id", user.id)
    .single();

  const { data: campaign } = await admin
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("account_id", account?.id || "")
    .single();

  if (!campaign) notFound();

  const slides = (campaign.slides as Array<{ index: number; headline: string; body: string }>) || [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {campaign.title || "Untitled Campaign"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Created {new Date(campaign.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${
          campaign.status === "published"
            ? "bg-green-100 text-green-700"
            : campaign.status === "draft"
            ? "bg-gray-100 text-gray-600"
            : "bg-blue-100 text-blue-700"
        }`}>
          {campaign.status}
        </span>
      </div>

      {slides.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Slides</h2>
          <div className="mt-4 space-y-3">
            {slides.map((slide, i) => (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-5"
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                    {slide.index || i + 1}
                  </span>
                  <h3 className="font-medium text-gray-900">{slide.headline}</h3>
                </div>
                <p className="mt-2 text-sm text-gray-600">{slide.body}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {campaign.caption && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Caption</h2>
          <p className="mt-2 rounded-xl border border-gray-200 bg-white p-5 text-sm text-gray-700">
            {campaign.caption}
          </p>
        </div>
      )}

      {campaign.landing_page_slug && (
        <div className="mt-6">
          <a
            href={`/p/${campaign.landing_page_slug}`}
            target="_blank"
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Landing Page →
          </a>
        </div>
      )}

      <CampaignActions
        campaignId={id}
        status={campaign.status}
        renderedSlides={(campaign.rendered_slides as string[]) || []}
      />
    </div>
  );
}
