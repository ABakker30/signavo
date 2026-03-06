import { createAdminClient } from "@/lib/db/supabase-server";
import type { Campaign } from "@/lib/types";

export async function getCampaigns(accountId: string): Promise<Campaign[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("account_id", accountId)
    .order("created_at", { ascending: false });

  if (error) return [];
  return data as Campaign[];
}

export async function getCampaign(id: string): Promise<Campaign | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Campaign;
}

export async function createCampaign(
  campaign: Partial<Campaign>
): Promise<Campaign | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("campaigns")
    .insert(campaign)
    .select()
    .single();

  if (error) return null;
  return data as Campaign;
}
