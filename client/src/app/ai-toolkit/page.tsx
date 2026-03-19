import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function AIToolkitPage() {
  return (
    <DashboardLayout>
      <div className="p-4">
        <h1 className="text-2xl font-bold">AI Teacher’s Toolkit</h1>
        <Empty
          title="AI Toolkit is Empty"
          description="Your AI tools, templates, and teaching resources will show up here once they’re added."
        />
      </div>
    </DashboardLayout>
  );
}
