import type { AdSettings } from "../../@types/database";
import { sqlDB } from "../database/exports";
import { google } from "googleapis";

export async function exchangeAuthCode(
  authCode: string
): Promise<string | undefined> {
  try {
    const secretData = sqlDB.getKey("adSettings");
    const response = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: authCode,
        client_id: secretData?.clientId,
        client_secret: secretData?.clientSecret,
        redirect_uri: getRedirectUri(),
        grant_type: "authorization_code",
      }),
    });

    const data = await response.json();
    return data.refresh_token;
  } catch {
    return undefined;
  }
}

export function generateAuthUrl(
  options: Pick<AdSettings, "clientId" | "clientSecret">,
  token: string | undefined
): string {
  const { clientId, clientSecret } = options;
  const redirectUri = getRedirectUri();
  const oAuth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    redirectUri
  );
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: ["https://www.googleapis.com/auth/adwords"],
    state: token,
  });

  return authUrl;
}

export function getRedirectUri() {
  return `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard/integrations/google-ads`;
}
