import { createAdminClient } from "@/lib/db/supabase-server";
import type { BrandProfile } from "@/lib/types";

export async function getBrandProfile(accountId: string): Promise<BrandProfile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brand_profiles")
    .select("*")
    .eq("account_id", accountId)
    .single();

  if (error) return null;
  return data as BrandProfile;
}

export async function upsertBrandProfile(
  accountId: string,
  profile: Partial<BrandProfile>
): Promise<BrandProfile | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("brand_profiles")
    .upsert({ account_id: accountId, ...profile, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return null;
  return data as BrandProfile;
}
