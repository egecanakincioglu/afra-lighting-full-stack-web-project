import { sendResponse } from "@/src/modules/api/handler";
import type { RequestResult } from "@/src/@types/database";
import { exchangeAuthCode, generateAuthUrl } from "@/src/modules/api/ads";
import { sqlDB } from "@/src/modules/database/exports";
import { isString } from "@/src/lib/helpers/verifications";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { objectParser } from "@/src/lib/helpers/objects";
import type { NextApiRequest, NextApiResponse } from "next";

async function handlePostRequest(req: NextApiRequest): Promise<RequestResult> {
  const token = req.cookies.sessionToken;
  const { status } = await verifyUser(token);

  if (!status) {
    return { message: "Unauthorized", status: false, code: 401 };
  }

  if ("code" in req.body) {
    const adSettings = sqlDB.getKey("adSettings") ?? {};
    if (["refreshToken"].some((item) => item in adSettings)) {
      return { message: "Already set", status: false };
    }

    const { code } = req.body;

    if (!isString(code)) {
      return { message: "Bad Request", status: false };
    }

    const refreshToken = await exchangeAuthCode(code);

    if (!refreshToken) {
      return { message: "Code grant failed", status: false };
    }

    sqlDB.overwriteKey("adSettings", { refreshToken });
    return { message: "Refresh token saved", status: true };
  }

  if ("developerToken" in req.body) {
    const [developerToken, managerId, customerId] = objectParser(req.body, [
      ["developerToken", isString],
      ["managerId", isString],
      ["customerId", isString],
    ]);

    if (!developerToken || !managerId || !customerId) {
      return { message: "Invalid body", status: false };
    }

    sqlDB.overwriteKey("adSettings", {
      developerToken,
      managerId,
      customerId,
    });

    return { message: "Settings saved", status: true };
  }

  const [clientId, clientSecret] = objectParser(req.body, [
    ["clientId", isString],
    ["clientSecret", isString],
  ]);

  if (!clientId || !clientSecret) {
    return { message: "Bad Request", status: false };
  }

  const authUrl = generateAuthUrl({ clientId, clientSecret }, token);
  sqlDB.setKey("adSettings", { clientId, clientSecret });
  return { message: "URL oluşturuldu", status: true, data: { authUrl } };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      return sendResponse(await handlePostRequest(req), res);
    }
    default: {
      return sendResponse(
        { code: 405, status: false, message: "Method Not Allowed" },
        res
      );
    }
  }
}
