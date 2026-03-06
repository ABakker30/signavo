import { SignOutButton } from "@/components/ui/sign-out-button";
import { MobileNav } from "@/components/ui/mobile-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="sticky top-0 z-40 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
          <a href="/dashboard" className="text-lg font-bold text-gray-900">
            Signavo
          </a>
          <div className="hidden md:flex items-center gap-6 text-sm text-gray-600">
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
            <a href="/dashboard/settings" className="hover:text-gray-900">
              Settings
            </a>
            <SignOutButton />
          </div>
          <MobileNav />
        </div>
      </nav>
      <main className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8">{children}</main>
    </div>
  );
}
