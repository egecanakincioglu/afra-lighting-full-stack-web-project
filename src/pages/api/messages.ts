import type { NextApiRequest, NextApiResponse } from "next";
import { sendResponse } from "@/src/modules/api/handler";
import { connection } from "@/src/modules/database/exports";
import type { RequestResult } from "@/src/@types/database";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { objectParser } from "@/src/lib/helpers/objects";
import {
  emailVerification,
  isNumber,
  isString,
} from "@/src/lib/helpers/verifications";
async function handleGetRequest(req: NextApiRequest): Promise<RequestResult> {
  const token = req.cookies.sessionToken;
  const { status } = await verifyUser(token);

  if (!status) {
    return { message: "Unauthorized", status: false, code: 401 };
  }

  const messages = await connection.db.messages.findMany();
  return { status: true, data: { messages } };
}

async function handlePostRequest(req: NextApiRequest): Promise<RequestResult> {
  const body = req.body;

  const [name, email, subject, message] = objectParser(body, [
    ["name", isString],
    ["email", isString],
    ["subject", isString],
    ["message", isString],
  ]);

  if (!name || !email || !subject || !message) {
    return { status: false, message: "Eksik bilgi girdiniz." };
  }

  if ([name, email, subject].some((item) => item.length > 128)) {
    return {
      status: false,
      message:
        "İsim, email veya konu metinleri 128 karakterden daha uzun olamaz.",
    };
  }

  if (message.length > 4096) {
    return {
      status: false,
      message: "Mesaj uzunluğu 4096 karakterden daha uzun olamaz.",
    };
  }

  if (!emailVerification(email)) {
    return { status: false, message: "Girilen email geçersiz" };
  }

  await connection.db.messages.create({
    data: { name, email, message, subject },
  });

  return { status: true, message: "Mesaj gönderildi" };
}

async function handleDeleteRequest(
  req: NextApiRequest
): Promise<RequestResult> {
  const token = req.cookies.sessionToken;
  const { status } = await verifyUser(token);

  if (!status) {
    return { message: "Unauthorized", status: false, code: 401 };
  }

  const body = req.body;

  const [id] = objectParser(body, [["id", isNumber]]);

  if (id === undefined) {
    return { status: false, message: "Id girdisi hatalı" };
  }

  try {
    await connection.db.messages.delete({ where: { id } });
    return { status: true, message: `${id} idli mesaj silindi` };
  } catch {
    return { status: false, message: "Bir hata oluştu", code: 500 };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      const result = await handlePostRequest(req);
      return sendResponse(result, res);
    }
    case "GET": {
      const result = await handleGetRequest(req);
      return sendResponse(result, res);
    }
    case "DELETE": {
      const result = await handleDeleteRequest(req);
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
