import type { User } from "@/src/@types/database";
import { connection } from "../exports";

export async function getUser(username: string): Promise<User | undefined> {
  const user = await connection.db.users.findFirst({ where: { username } });

  if (!user) return;

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    passwordHash: user.password_hash,
    createdAt: user.created_at ?? new Date(),
    sessions: JSON.parse(user.sessions ?? "[]"),
  };
}
