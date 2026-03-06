import { SignOutButton } from "@/components/ui/sign-out-button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-6">
          <a href="/dashboard" className="text-lg font-bold text-gray-900">
            Signavo
          </a>
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <a href="/dashboard/brand" className="hover:text-gray-900">
              Brand
            </a>
            <a href="/dashboard/campaigns" className="hover:text-gray-900">
              Campaigns
            </a>
            <a href="/dashboard/suggestions" className="hover:text-gray-900">
              Suggestions
            </a>
            <a href="/dashboard/support" className="hover:text-gray-900">
              Support
            </a>
            <SignOutButton />
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
}
