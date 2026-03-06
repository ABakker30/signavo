import { getRequestConfig } from "next-intl/server";
import { createClient, createAdminClient } from "@/lib/db/supabase-server";

export default getRequestConfig(async () => {
  let locale = "en";

  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const admin = createAdminClient();
      const { data: account } = await admin
        .from("accounts")
        .select("ui_language")
        .eq("user_id", user.id)
        .single();

      if (account?.ui_language) {
        locale = account.ui_language;
      }
    }
  } catch {
    // Fall back to default locale
  }

  const messages = (await import(`../../messages/${locale}.json`)).default;

  return {
    locale,
    messages,
  };
});
