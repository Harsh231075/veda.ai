import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function GroupsPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">My Groups</h1>
        <Empty 
          title="No Groups Found" 
          description="You haven't joined or created any classrooms or groups. Create or join one to begin."
        />
      </div>
    </DashboardLayout>
  );
}
