import "server-only";
import { auth } from "@clerk/nextjs/server";

// Guard the data boundary as well as the dashboard URL. Server Actions can be
// invoked independently of the UI that displays them.
export async function requireCrmUser(): Promise<string> {
  if (
    !process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
    !process.env.CLERK_SECRET_KEY
  ) {
    throw new Error("CRM authentication is not configured.");
  }

  const { userId } = await auth();
  if (!userId) {
    throw new Error("Authentication required.");
  }

  return userId;
}
