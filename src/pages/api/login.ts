import { addUserSession } from "@/src/modules/database/events/addUserSession";
import { createEncryptedJWT } from "@/src/modules/auth/authService";
import { getExpirationTime } from "@/src/modules/auth/jwt";
import type { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";
import { verifyUserLoginData } from "@/src/modules/database/events/verifyUser";
import type { UserLoginData } from "@/src/@types/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { username, password } = req.body as UserLoginData;
  const isLoginDataValid = await verifyUserLoginData({ username, password });

  if (!isLoginDataValid) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = await createEncryptedJWT({ username });
  await addUserSession(username, token);

  res.setHeader(
    "Set-Cookie",
    serialize("sessionToken", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: getExpirationTime(),
      path: "/",
    })
  );

  return res.status(200).json({ message: "Login successful" });
}
