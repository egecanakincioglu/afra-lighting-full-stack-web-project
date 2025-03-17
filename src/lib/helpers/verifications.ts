import type {
  GenerateSiteRegexOptions,
  ObjectVerificationData,
  VerificationFunction,
} from "@/src/@types/helpers";

export const facebookSiteVerification = socialMediaVerification({
  siteNames: ["facebook"],
});
export const instagramSiteVerification = socialMediaVerification({
  siteNames: ["instagram"],
});
export const whatsappSiteVerification = socialMediaVerification({
  siteNames: ["wa", "whatsapp"],
  extensionNames: ["me", "com"],
});
export const twitterSiteVerification = socialMediaVerification({
  siteNames: ["twitter", "x"],
});

export function emailVerification(email: unknown): boolean {
  return isString(email) && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}

export function passwordVerification(password: unknown): boolean {
  return isString(password) && password.length >= 6;
}

export function phoneVerification(phone: unknown): boolean {
  return isString(phone) && /^\+?[0-9\s\-]+$/.test(phone);
}

export function socialMediaVerification({
  siteNames,
  extensionNames,
}: GenerateSiteRegexOptions): VerificationFunction {
  return (input: unknown) =>
    isString(input) &&
    generateSiteRegex({ siteNames, extensionNames }).test(input);
}

function generateSiteRegex({
  siteNames,
  extensionNames = ["com"],
}: GenerateSiteRegexOptions): RegExp {
  const siteNameRegex = siteNames.join("|");
  const extensionNameRegex = extensionNames.join("|");
  return new RegExp(
    `^https?:\\/\\/(www\\.)?(${siteNameRegex})\\.(${extensionNameRegex})\\/.*$`
  );
}

export function isNumber(input: unknown): input is number {
  return typeof input === "number";
}

export function isString(input: unknown): input is string {
  return typeof input === "string";
}

export function isBoolean(input: unknown): input is boolean {
  return typeof input === "boolean";
}

export function isObject(input: unknown): input is Exclude<object, null> {
  return typeof input === "object" && input !== null;
}

export function isArray(input: unknown): input is unknown[] {
  return Array.isArray(input);
}

export function objectVerify(
  data: object,
  verification: ObjectVerificationData
): boolean {
  if (!data) return false;

  const keys = Object.keys(verification);
  const dataKeys = Object.keys(data);
  const keyLengthCheckFailed = keys.length !== dataKeys.length;

  if (keyLengthCheckFailed) return false;

  for (const key of keys) {
    const keyNotFound = !dataKeys.includes(key);

    if (keyNotFound) return false;

    const verificationData = verification[key];
    const objectData = data[key as keyof typeof data];
    const [typeVerification, verifications = []] = verificationData;

    if ([typeVerification, ...verifications].some((test) => !test(objectData)))
      return false;
  }

  return true;
}
