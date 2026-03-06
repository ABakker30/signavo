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
          industryType: account?.industry_type || "REAL_ESTATE",
          streetAddress: account?.street_address || "",
          addressLine2: account?.address_line_2 || "",
          city: account?.city || "",
          region: account?.region || "",
          postalCode: account?.postal_code || "",
          country: account?.country || "US",
          websiteUrl: account?.website_url || "",
          businessPhone: account?.business_phone || "",
          businessEmail: account?.business_email || "",
          licenseNumber: account?.license_number || "",
          yearsInBusiness: account?.years_in_business?.toString() || "",
          tagline: account?.tagline || "",
        }}
      />
    </div>
  );
}
