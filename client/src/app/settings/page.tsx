import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Empty 
          title="Settings Configuration" 
          description="Customize your profile, configure your organization details, and adjust notification preferences here."
        />
      </div>
    </DashboardLayout>
  );
}
