import { NewCampaignForm } from "@/components/campaigns/new-campaign-form";

export default function NewCampaignPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900">New Campaign</h1>
      <p className="mt-1 text-sm text-gray-500">
        Provide a source for your market update.
      </p>
      <NewCampaignForm />
    </div>
  );
}
