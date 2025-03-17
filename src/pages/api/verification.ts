import { sendResponse } from "@/src/modules/api/handler";
import type { RequestResult } from "@/src/@types/database";
import { pendingEmailDB } from "@/src/modules/database/exports";
import { isObject, isString } from "@/src/lib/helpers/verifications";
import { getUser } from "@/src/modules/database/events/getUser";
import { updateUser } from "@/src/modules/database/events/updateUser";
import type { NextApiRequest, NextApiResponse } from "next";
import * as mailer from "nodemailer";
import bcrypt from "bcrypt";
import { objectParser } from "@/src/lib/helpers/objects";

const transporter = mailer.createTransport({
  host: process.env.EMAIL_SMTP as string,
  port: parseInt(process.env.EMAIL_PORT as string),
  auth: {
    user: process.env.EMAIL_USER as string,
    pass: process.env.EMAIL_PASS as string,
  },
});

async function handlePost(req: NextApiRequest): Promise<RequestResult> {
  const body = req.body;
  const bodyVerification = isObject(body);

  if (!bodyVerification) {
    return { status: false, message: "Gönderilen veri eksik" };
  }

  const [username, email, code, newPassword] = objectParser(body, [
    ["username", isString],
    ["email", isString],
    ["code", isString],
    ["newPassword", isString],
  ]);

  if (username) {
    const pendingEmail = pendingEmailDB.getKey(username);

    if (code) {
      if (!pendingEmail) {
        return { status: false, message: "Email gönderme işlemi yapılmadı" };
      }

      if (!newPassword) {
        return { status: false, message: "Yeni şifre eksik" };
      }

      const { email: pendingEmailValue, token } = pendingEmail;

      if (email !== pendingEmailValue) {
        return { status: false, message: "Email adresi hatalı" };
      }

      if (code !== token) {
        return { status: false, message: "Kod hatalı" };
      }

      const passwordHash = bcrypt.hashSync(newPassword, 10);
      await updateUser(username, { passwordHash, sessions: [] });
      pendingEmailDB.deleteKey(username);

      return { status: true, message: "Kod doğru" };
    }

    if (email) {
      const user = await getUser(username);

      if (!user) {
        return { status: false, message: "Kullanıcı bulunamadı" };
      }

      if (pendingEmail) {
        return {
          status: false,
          message: "Email gönderme işlemi zaten yapıldı",
        };
      }

      const emailCheck = user.email === email;

      if (!emailCheck) {
        return { status: false, message: "Email adresi hatalı" };
      }

      const passwordChangeCode = Math.random().toString(36).substring(2, 8);
      const passwordChangeText = `${username} kullanıcısının şifresini değiştirmek için kod: ${passwordChangeCode}, 5 dakika içinde kullanınız.`;

      const info = await transporter.sendMail({
        from: process.env.EMAIL_USER as string,
        to: email,
        subject: "Şifre değişiklik kodu",
        text: `${passwordChangeText}`,
        html: `<b>${passwordChangeText}</b>`,
      });

      if (info.rejected.length) {
        return { status: false, message: "Email gönderilemedi" };
      }

      pendingEmailDB.setKey(user.username, {
        email: user.email,
        token: passwordChangeCode,
      });

      return { status: true, message: "Email gönderildi" };
    }

    return { status: true, data: { pending: !!pendingEmail } };
  }

  return { status: false, message: "Kullanıcı adı veya email eksik" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      const result = await handlePost(req);
      return sendResponse(result, res);
    }
    default: {
      return sendResponse(
        { status: false, code: 405, message: "Method Not Allowed" },
        res
      );
    }
  }
}
