import { createClient } from "@/lib/db/supabase-server";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;
  return user;
}

export async function getAccountContext() {
  const user = await getAuthenticatedUser();
  if (!user) return null;

  const admin = createAdminClient();
  const { data: account } = await admin
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!account) return null;

  const { data: brandProfile } = await admin
    .from("brand_profiles")
    .select("*")
    .eq("account_id", account.id)
    .single();

  return {
    user: {
      id: user.id,
      email: user.email!,
      fullName: user.user_metadata?.full_name || "",
    },
    account: {
      id: account.id,
      businessName: account.business_name,
      location: account.location,
      brandStatus: brandProfile?.status || "not_started",
      industryType: account.industry_type || "REAL_ESTATE",
      region: account.region || null,
      tagline: account.tagline || "",
    },
    brandProfile,
  };
}
