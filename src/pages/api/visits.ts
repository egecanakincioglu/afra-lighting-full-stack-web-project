import type { NextApiRequest, NextApiResponse } from "next";
import { connection } from "@/src/modules/database/exports";
import { verifyUser } from "@/src/modules/database/events/verifyUser";
import type { VisitData } from "@/src/@types/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const sessionToken = req.cookies.sessionToken;
  const { status } = await verifyUser(sessionToken);

  if (!status) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const visits = await connection.db.visits.findMany();

  const newData: VisitData[] = visits.map((visit) => ({
    pageViewed: visit.page_viewed ?? "",
    country: visit.country ?? "Unknown",
    city: visit.city ?? "Unknown",
    visitDate: visit.visit_date ?? new Date(),
    ipAddress: visit.ip_address ?? "Unknown",
    referrer: visit.referrer ?? "Unknown",
    userAgent: visit.user_agent ?? "Unknown",
  }));

  return res.status(200).json(newData);
}
