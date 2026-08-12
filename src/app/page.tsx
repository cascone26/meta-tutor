import { auth } from "@/auth";
import HubContent from "@/components/HubContent";

export default async function HubPage() {
  const session = await auth();
  const firstName = session?.user?.name?.split(" ")[0] ?? null;

  return <HubContent firstName={firstName} />;
}
