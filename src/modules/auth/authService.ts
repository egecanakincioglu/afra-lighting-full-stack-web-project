import { EncryptJWT, jwtDecrypt, type JWTPayload } from "jose";
import {
  getExpirationTime,
  getPrivateKey,
  getPublicKey,
} from "@/src/modules/auth/jwt";
import type { VerifyTokenResult } from "@/src/@types/database";
import { isObject, isString } from "@/src/lib/helpers/verifications";
import { connection } from "../database/exports";

export function startTokenVerification(): void {
  setInterval(async () => {
    const db = (await connection.initalize())?.db;

    if (!db) return;

    const users = await db.users.findMany();

    for (const user of users) {
      const { username, sessions: rawSessions } = user;
      const sessions: string[] = JSON.parse(rawSessions ?? "[]");

      const removedSessions: string[] = [];

      for (const session of sessions) {
        const { status } = await verifyToken(session);

        if (!status) {
          removedSessions.push(session);
        }
      }

      if (!removedSessions.length) {
        continue;
      }

      await db.users.update({
        data: {
          sessions: JSON.stringify(
            sessions.filter((ses) => !removedSessions.includes(ses))
          ),
        },
        where: { username },
      });
    }
  }, getExpirationTime() * 1000);
}

export async function verifyToken(
  encryptedToken: string | undefined
): Promise<VerifyTokenResult> {
  if (!encryptedToken?.length) {
    return { status: false };
  }

  try {
    const { payload } = await jwtDecrypt(encryptedToken, await getPrivateKey());
    const currentTime = Math.floor(Date.now() / 1000);

    if (payload.exp && payload.exp < currentTime) {
      return {
        status: false,
        data: { token: encryptedToken, payload },
      };
    }

    return {
      status: true,
      data: { token: encryptedToken, payload },
    };
  } catch (error) {
    const isErrorFromTime =
      isObject(error) &&
      "code" in error &&
      isString(error.code) &&
      error.code === "ERR_JWT_EXPIRED";
    if (!isErrorFromTime) {
      console.error(error);
    }
    return { status: false };
  }
}

export function formatKey(key: string, type: "private" | "public") {
  const header =
    type === "private"
      ? "-----BEGIN PRIVATE KEY-----"
      : "-----BEGIN PUBLIC KEY-----";
  const footer =
    type === "private"
      ? "-----END PRIVATE KEY-----"
      : "-----END PUBLIC KEY-----";

  const formattedKey = key.match(/.{1,64}/g)?.join("\n");
  return `${header}\n${formattedKey}\n${footer}`;
}

export async function createEncryptedJWT(
  payload: JWTPayload,
  expiresInSeconds = getExpirationTime()
) {
  const jwe = await new EncryptJWT(payload)
    .setIssuedAt()
    .setExpirationTime(`${expiresInSeconds} s`)
    .setProtectedHeader({ alg: "RSA-OAEP", enc: "A256GCM" })
    .encrypt(await getPublicKey());

  return jwe;
}
