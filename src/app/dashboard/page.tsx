import { redirect } from "next/navigation";

const DashboardRoot = () => {
  redirect("/dashboard/jobs");
};

export default DashboardRoot;
