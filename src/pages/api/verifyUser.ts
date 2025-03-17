import { verifyUser } from "@/src/modules/database/events/verifyUser";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  switch (req.method) {
    case "POST": {
      const sessionToken = req.body.sessionToken;
      const { status } = await verifyUser(sessionToken);

      if (!status) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      return res.status(200).json({ message: "Authorized" });
    }
    default: {
      return res.status(405).json({ message: "Method Not Allowed" });
    }
  }
}
