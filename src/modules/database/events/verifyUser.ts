import { getUser } from "./getUser";
import { verifyToken } from "../../auth/authService";
import bcrypt from "bcrypt";
import type { UserLoginData, VerifyUserResult } from "@/src/@types/database";
import { updateUser } from "./updateUser";

export async function verifyUser(
  sessionToken: string | undefined
): Promise<VerifyUserResult> {
  if (!sessionToken) {
    return { status: false };
  }

  const { status, data } = await verifyToken(sessionToken);
  const { payload } = data ?? {};

  const username = payload?.username;

  if (typeof username !== "string") {
    return { status: false };
  }

  const user = await getUser(username);

  if (!user) {
    return { status: false };
  }

  if (!status) {
    if (data) {
      const finalUserSessions = user.sessions.filter(
        (session) => session !== sessionToken
      );

      await updateUser(username, { sessions: finalUserSessions });
    }

    return { status: false };
  }

  const userSessions = user?.sessions;
  const isSessionValid = !!userSessions?.includes(sessionToken);

  return isSessionValid ? { status: true, user } : { status: false };
}

export async function verifyUserLoginData(
  userData: UserLoginData
): Promise<boolean> {
  const { username, password } = userData;
  const user = await getUser(username);

  if (!user) return false;

  return bcrypt.compareSync(password, user.passwordHash);
}
