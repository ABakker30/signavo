import { NextResponse } from "next/server";
import { getAccountContext } from "@/lib/auth/get-session";

export async function GET() {
  const context = await getAccountContext();

  if (!context) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHORIZED", message: "Not authenticated" } },
      { status: 401 }
    );
  }

  // Stub: hardcoded suggestions for V1
  // Will later be driven by signals and timing
  const suggestions = [
    {
      id: "weekly-market-update",
      type: "WEEKLY",
      title: "Weekly Market Update",
      description:
        "Share what's happening in the Hampton Roads market this week. Stay visible and build trust with your audience.",
    },
    {
      id: "rate-change-commentary",
      type: "SIGNAL",
      title: "Rate Change Commentary",
      description:
        "Interest rates shifted recently. A timely update can position you as a knowledgeable local resource.",
    },
    {
      id: "seasonal-activity",
      type: "SIGNAL",
      title: "Spring Seller Activity Update",
      description:
        "Spring activity is picking up in Hampton Roads. Share insights that help sellers feel confident.",
    },
  ];

  return NextResponse.json({
    success: true,
    data: { suggestions },
  });
}
