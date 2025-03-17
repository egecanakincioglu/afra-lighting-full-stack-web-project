import { sendResponse } from "@/src/modules/api/handler";
import type { RequestResult } from "@/src/@types/database";
import { sqlDB } from "@/src/modules/database/exports";
import { isString } from "@/src/lib/helpers/verifications";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import { objectParser } from "@/src/lib/helpers/objects";
import { GoogleAdsApi } from "google-ads-api";
import type { NextApiRequest, NextApiResponse } from "next";

async function handleGetRequest(req: NextApiRequest): Promise<RequestResult> {
  try {
    const token = req.cookies.sessionToken;
    const { status } = await verifyUser(token);

    if (!status) {
      return { message: "Unauthorized", status: false, code: 401 };
    }

    const {
      clientId,
      clientSecret,
      developerToken,
      managerId,
      customerId,
      refreshToken,
    } = sqlDB.getKey("adSettings") ?? {};

    if (
      !clientId ||
      !clientSecret ||
      !refreshToken ||
      !managerId ||
      !customerId ||
      !developerToken
    ) {
      return { message: "Missing environment variables", status: false };
    }

    const client = new GoogleAdsApi({
      client_id: clientId,
      client_secret: clientSecret,
      developer_token: developerToken,
    });

    const customer = client.Customer({
      login_customer_id: managerId,
      customer_id: customerId,
      refresh_token: refreshToken,
    });

    const result = await customer.report({
      entity: "campaign",
      attributes: ["campaign.id", "campaign.name"],
      metrics: ["metrics.clicks", "metrics.impressions", "metrics.ctr"],
      date_constant: "LAST_7_DAYS",
    });

    return { status: true, data: result };
  } catch (error) {
    console.error(error);
    return { status: false, code: 500, message: "Internal server error" };
  }
}

async function handlePostRequest(req: NextApiRequest): Promise<RequestResult> {
  const token = req.cookies.sessionToken;
  const { status } = await verifyUser(token);

  if (!status) {
    return { message: "Unauthorized", status: false, code: 401 };
  }

  const [clientId, clientSecret, developerToken, managerId, customerId] =
    objectParser(req.body, [
      ["clientId", isString],
      ["clientSecret", isString],
      ["developerToken", isString],
      ["managerId", isString],
      ["customerId", isString],
    ]);

  if (
    !clientId ||
    !clientSecret ||
    !developerToken ||
    !managerId ||
    !customerId
  ) {
    return { message: "Invalid body", status: false, code: 400 };
  }

  sqlDB.overwriteKey("adSettings", {
    clientId,
    clientSecret,
    developerToken,
    managerId,
    customerId,
  });

  return { status: true, message: "Settings saved" };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "GET": {
      return sendResponse(await handleGetRequest(req), res);
    }
    case "POST": {
      return sendResponse(await handlePostRequest(req), res);
    }
    default: {
      return sendResponse(
        { message: "Method Not Allowed", status: false, code: 405 },
        res
      );
    }
  }
}
