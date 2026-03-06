import { SupportChat } from "@/components/support/support-chat";

export default function SupportPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Support</h1>
      <p className="mt-1 text-sm text-gray-500">
        Get help with your account or campaigns.
      </p>
      <SupportChat />
    </div>
  );
}
