import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function GroupsPage() {
  return (
    <DashboardLayout>
      <Empty
        title="No Groups Found"
        description="You haven't joined or created any classrooms or groups. Create or join one to begin."
      />
    </DashboardLayout>
  );
}
