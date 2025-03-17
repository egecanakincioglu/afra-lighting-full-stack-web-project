import { importPKCS8, importSPKI, type KeyLike } from "jose";
import { formatKey } from "./authService";

let privateKey: KeyLike;
let publicKey: KeyLike;

export async function getPublicKey() {
  if (!publicKey) {
    publicKey = await importSPKI(
      formatKey(process.env.JWT_PUBLIC_KEY!, "public"),
      "RSA-OAEP"
    );
  }

  return publicKey;
}

export async function getPrivateKey() {
  if (!privateKey) {
    privateKey = await importPKCS8(
      formatKey(process.env.JWT_PRIVATE_KEY!, "private"),
      "RSA-OAEP"
    );
  }

  return privateKey;
}

export function getExpirationTime(): number {
  const time = process.env.JWT_EXPIRATION_TIME;
  return time ? (Number.isNaN(parseInt(time)) ? 3600 : parseInt(time)) : 3600;
}
