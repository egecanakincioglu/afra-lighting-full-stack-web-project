import type { FirstLoginStep2, FirstLoginStep3 } from "../../@types/database";
import type { ObjectVerificationData } from "../../@types/helpers";
import { firstLoginDB } from "../database/exports";
import {
  emailVerification,
  isString,
  passwordVerification,
} from "../../lib/helpers/verifications";

export function getStep(
  step: number
): FirstLoginStep2 | FirstLoginStep3 | boolean | undefined {
  const firstLoginData = firstLoginDB.get();
  const stepCheckFailed = !Number.isSafeInteger(step) || step < 1 || step > 3;
  const key = `step${step}` as keyof typeof firstLoginData;
  return stepCheckFailed ? undefined : firstLoginData[key];
}

export function getLastCompletedStep(): number {
  const firstLoginData = firstLoginDB.get();
  const filterKey = "step";
  const steps = Object.keys(firstLoginData)
    .filter((key) => key.startsWith(filterKey))
    .map((key) => +key.slice(filterKey.length));
  return steps.length ? Math.max(...steps) : 0;
}

export const step2Verification: ObjectVerificationData = {
  host: [isString],
  user: [isString],
  password: [isString],
  database: [isString],
};

export const step3Verification: ObjectVerificationData = {
  email: [isString, [emailVerification]],
  password: [isString, [passwordVerification]],
};
