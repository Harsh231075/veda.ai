import DashboardLayout from "@/components/DashboardLayout";
import Empty from "@/components/Empty";

export default function AIToolkitPage() {
  return (
    <DashboardLayout>
      <Empty
        title="AI Toolkit is Empty"
        description="Your AI tools, templates, and teaching resources will show up here once they’re added."
      />
    </DashboardLayout>
  );
}
