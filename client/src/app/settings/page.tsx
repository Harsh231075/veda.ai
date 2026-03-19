import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Empty
        title="Settings Configuration"
        description="Customize your profile, configure your organization details, and adjust notification preferences here."
      />
    </DashboardLayout>
  );
}
