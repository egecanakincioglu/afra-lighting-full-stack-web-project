import { NextRequest, NextResponse } from "next/server";
import { allowedPaths } from "./lib/config/files";
import { getAPIPath, verifyUserFromAPI } from "./lib/helpers/api";
import type { FirstLoginGETData } from "./@types/database";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const isControlled =
    allowedPaths.some((path) => pathname.startsWith(`/${path}`)) ||
    pathname === "/";

  if (!isControlled) {
    return NextResponse.next();
  }

  const sessionToken = req.cookies.get("sessionToken")?.value;
  const apiRequestURL = getAPIPath("firstLogin");
  const { available, currentStep }: FirstLoginGETData = await (
    await fetch(apiRequestURL)
  ).json();

  if (pathname.startsWith("/setup")) {
    if (!available) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    const currentStepUrl = `/setup/step-${currentStep}`;

    if (currentStep === 1) {
      if (pathname === "/setup" || currentStepUrl === pathname)
        return NextResponse.next();
      return NextResponse.redirect(new URL("/setup", req.url));
    }

    if (pathname !== currentStepUrl) {
      return NextResponse.redirect(new URL(currentStepUrl, req.url));
    }

    return NextResponse.next();
  }

  if (available) {
    return NextResponse.redirect(new URL("/setup", req.url));
  }

  if (pathname.startsWith("/dashboard")) {
    let finalSessionToken = sessionToken;

    const reqURL = req.url;

    if (reqURL.includes("?")) {
      const convertedURL = new URL(reqURL);

      if (convertedURL.searchParams.has("state")) {
        finalSessionToken = convertedURL.searchParams.get("state") ?? undefined;
      }
    }

    const isMainPage = pathname === "/dashboard";
    const tokenVerification = await verifyUserFromAPI(finalSessionToken);

    if (!tokenVerification) {
      if (!isMainPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    } else {
      if (isMainPage) {
        return NextResponse.redirect(new URL("/dashboard/view", req.url));
      }
    }
  }

  return NextResponse.next();
}
