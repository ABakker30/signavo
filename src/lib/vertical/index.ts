import { createAdminClient } from "@/lib/db/supabase-server";
import type { VerticalConfig } from "@/lib/types";

export async function getVerticalConfig(key: string): Promise<VerticalConfig | null> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vertical_configs")
    .select("*")
    .eq("key", key)
    .eq("active", true)
    .single();

  if (error || !data) return null;
  return data as VerticalConfig;
}

export async function getActiveVerticalConfigs(): Promise<VerticalConfig[]> {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("vertical_configs")
    .select("*")
    .eq("active", true)
    .order("label");

  if (error) return [];
  return data as VerticalConfig[];
}

export const DEFAULT_VERTICAL_KEY = "real_estate_hampton_roads_en";
