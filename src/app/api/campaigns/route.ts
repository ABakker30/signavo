import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function GET() {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const admin = createAdminClient();
  const { data: campaigns, error } = await admin
    .from("campaigns")
    .select("id, title, status, created_at, updated_at, landing_page_slug")
    .eq("account_id", context.account.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "FETCH_FAILED", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      campaigns: (campaigns || []).map((c) => ({
        id: c.id,
        title: c.title,
        status: c.status,
        createdAt: c.created_at,
        publishedAt: c.status === "published" ? c.updated_at : null,
      })),
    },
  });
}

export async function POST(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const body = await request.json();
  const { title, inputType, rawText, sourceUrl } = body;

  if (!inputType) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Input type is required" } },
      { status: 400 }
    );
  }

  const admin = createAdminClient();
  const { data: campaign, error } = await admin
    .from("campaigns")
    .insert({
      account_id: context.account.id,
      title: title || "Untitled Campaign",
      input_type: inputType.toLowerCase(),
      input_data: rawText || sourceUrl || "",
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { success: false, error: { code: "CREATE_FAILED", message: error.message } },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      id: campaign.id,
      title: campaign.title,
      status: campaign.status,
    },
  });
}
