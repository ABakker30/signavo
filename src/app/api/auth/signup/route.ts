import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/db/supabase-server";

export async function POST(request: NextRequest) {
  const { name, email, password, business } = await request.json();

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
        business_name: business,
      },
    },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  if (data.session) {
    return NextResponse.json({ redirect: "/dashboard/onboarding" });
  }

  return NextResponse.json({
    message: "Check your email to confirm your account.",
  });
}
