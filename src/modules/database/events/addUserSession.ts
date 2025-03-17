import type { User } from "@/src/@types/database";
import { getUser } from "./getUser";
import { updateUser } from "./updateUser";

export async function addUserSession(
  username: string,
  session: string
): Promise<User | undefined> {
  const user = await getUser(username);

  if (!user) return;

  return await updateUser(username, {
    sessions: Array.from(new Set([...(user.sessions ?? []), session])),
  });
}
