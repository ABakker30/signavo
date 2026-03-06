import { NextRequest, NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";
import { createAdminClient } from "@/lib/db/supabase-server";

export async function POST(request: NextRequest) {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "No file uploaded" } },
      { status: 400 }
    );
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "Only JPG, PNG, and WebP images are allowed" } },
      { status: 400 }
    );
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return NextResponse.json(
      { success: false, error: { code: "VALIDATION_ERROR", message: "File must be under 5MB" } },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop() || "jpg";
  const fileName = `${context.account.id}/headshot.${ext}`;

  const admin = createAdminClient();

  // Upload to Supabase Storage
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await admin.storage
    .from("headshots")
    .upload(fileName, buffer, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    return NextResponse.json(
      { success: false, error: { code: "UPLOAD_FAILED", message: uploadError.message } },
      { status: 500 }
    );
  }

  // Get public URL
  const { data: urlData } = admin.storage
    .from("headshots")
    .getPublicUrl(fileName);

  const headshot_url = urlData.publicUrl;

  // Save URL to brand profile
  await admin
    .from("brand_profiles")
    .update({
      headshot_url,
      updated_at: new Date().toISOString(),
    })
    .eq("account_id", context.account.id);

  return NextResponse.json({
    success: true,
    data: { headshotUrl: headshot_url },
  });
}
