import HomePage from "./components/HomePage";
import { getAuthSession } from "./lib/auth";

export default async function Page() {
  const session = await getAuthSession();
  return <HomePage session={session} />;
}
