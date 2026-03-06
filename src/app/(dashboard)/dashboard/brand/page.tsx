import { createClient } from "@/lib/db/supabase-server";
import { createAdminClient } from "@/lib/db/supabase-server";
import { BrandSetupForm } from "@/components/brand/brand-setup-form";

export default async function BrandPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let brandData = null;
  if (user) {
    const admin = createAdminClient();
    const { data: account } = await admin
      .from("accounts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (account) {
      const { data: brand } = await admin
        .from("brand_profiles")
        .select("*")
        .eq("account_id", account.id)
        .single();

      if (brand) {
        brandData = {
          websiteUrl: brand.website_url || "",
          positioning: brand.positioning || "",
          knownFor: brand.known_for || "",
          tone: brand.tone || "",
          audienceFocus: brand.audience_focus || "",
          headshotUrl: brand.headshot_url || "",
        };
      }
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Brand Setup</h1>
      <p className="mt-1 text-sm text-gray-500">
        Define how you want to be known in your community.
      </p>
      <BrandSetupForm initialData={brandData || undefined} />
    </div>
  );
}
