import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { updateUser } from "@/src/modules/database/events/updateUser";
import {
  emailVerification,
  passwordVerification,
} from "@/src/lib/helpers/verifications";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const sessionToken = req.cookies.sessionToken;
  const verifyResult = await verifyUser(sessionToken);

  const { status } = verifyResult;

  if (!status) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { currentPassword, newPassword, currentEmail, newEmail } = req.body;

  if (!currentPassword) {
    return res.status(400).json({ message: "Mevcut şifre eksik" });
  }

  const { user } = verifyResult;

  const isPasswordValid = bcrypt.compareSync(
    currentPassword,
    user.passwordHash
  );

  if (!isPasswordValid) {
    return res.status(400).json({ message: "Mevcut şifreniz yanlış" });
  }

  if (newPassword) {
    const verified = passwordVerification(newPassword);

    if (!verified) {
      return res.status(400).json({ message: "Yeni şifreniz çok kısa" });
    }

    const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
    await updateUser(user.username, {
      passwordHash: hashedNewPassword,
      sessions: [],
    });

    return res.status(200).json({ message: "Şifre başarıyla değiştirildi" });
  } else if (currentEmail && newEmail) {
    if (user.email !== currentEmail) {
      return res.status(400).json({ message: "Mevcut emailiniz yanlış" });
    }

    const verified = emailVerification(newEmail);

    if (!verified) {
      return res.status(400).json({ message: "Yeni emailiniz geçersiz" });
    }

    await updateUser(user.username, {
      username: newEmail,
      email: newEmail,
      sessions: [],
    });

    return res.status(200).json({ message: "Email başarıyla değiştirildi" });
  } else {
    return res
      .status(400)
      .json({ message: "Değiştirmek istediğiniz kısmı giriniz" });
  }
}
