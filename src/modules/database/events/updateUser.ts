import { connection } from "../exports";
import { omit } from "@/src/lib/helpers/objects";
import type { User } from "@/src/@types/database";
import { getUser } from "./getUser";

export async function updateUser(
  username: string,
  newData: Partial<User>
): Promise<User | undefined> {
  const user = await getUser(username);

  if (!user) return;

  const newUser = { ...user, ...newData } satisfies User;
  const newUserWithoutId = omit(newUser, ["id"]);

  const dbData = {
    username: newUserWithoutId.username,
    email: newUserWithoutId.email,
    created_at: newUserWithoutId.createdAt,
    password_hash: newUserWithoutId.passwordHash,
    sessions: JSON.stringify(newUser.sessions ?? []),
  };

  await connection.db.users.update({ data: dbData, where: { username } });
  return newUser;
}
