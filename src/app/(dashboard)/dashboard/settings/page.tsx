import { createClient, createAdminClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";
import { AccountSettingsForm } from "@/components/account/account-settings-form";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: account } = await admin
    .from("accounts")
    .select("*")
    .eq("user_id", user.id)
    .single();

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
      <p className="mt-1 text-sm text-gray-500">
        Manage your account information.
      </p>
      <AccountSettingsForm
        initialData={{
          fullName: user.user_metadata?.full_name || "",
          email: user.email || "",
          businessName: account?.business_name || "",
          city: account?.city || "",
          region: account?.region || "",
          postalCode: account?.postal_code || "",
          websiteUrl: account?.website_url || "",
        }}
      />
    </div>
  );
}
