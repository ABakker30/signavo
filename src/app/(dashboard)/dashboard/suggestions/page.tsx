import { createClient, createAdminClient } from "@/lib/db/supabase-server";
import { redirect } from "next/navigation";

export default async function SuggestionsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const admin = createAdminClient();
  const { data: account } = await admin
    .from("accounts")
    .select("id, vertical_config_key")
    .eq("user_id", user.id)
    .single();

  // Try DB suggestions first, fall back to vertical config templates
  let suggestions: Array<{ id: string; type: string; title: string; description: string }> = [];

  if (account) {
    const { data: dbSuggestions } = await admin
      .from("suggestions")
      .select("*")
      .eq("account_id", account.id)
      .eq("status", "NEW")
      .order("created_at", { ascending: false });

    if (dbSuggestions && dbSuggestions.length > 0) {
      suggestions = dbSuggestions;
    } else {
      // Fall back to vertical config templates
      const { data: config } = await admin
        .from("vertical_configs")
        .select("suggestion_templates")
        .eq("key", account.vertical_config_key || "real_estate_hampton_roads_en")
        .single();

      if (config?.suggestion_templates) {
        suggestions = (config.suggestion_templates as Array<{ type: string; title: string; description: string }>).map(
          (t, i) => ({ id: `template-${i}`, ...t })
        );
      }
    }
  }

  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Suggestions</h1>
      <p className="mt-1 text-sm text-gray-500">
        Content ideas and campaign suggestions.
      </p>
      <div className="mt-6 sm:mt-8 space-y-4">
        {suggestions.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white p-8 sm:p-12 text-center">
            <p className="text-sm text-gray-400">No suggestions right now. Check back soon.</p>
          </div>
        ) : (
          suggestions.map((s) => (
            <div key={s.id} className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
              <div className="flex items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                  s.type === "WEEKLY"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-amber-100 text-amber-700"
                }`}>
                  {s.type}
                </span>
                <p className="text-sm font-medium text-gray-900">{s.title}</p>
              </div>
              <p className="mt-2 text-sm text-gray-500">{s.description}</p>
              <a
                href="/dashboard/campaigns/new"
                className="mt-3 inline-block text-sm font-medium text-gray-900 hover:underline"
              >
                Create campaign →
              </a>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
