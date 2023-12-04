import type { NextApiHandler, NextApiResponse, NextApiRequest } from "next";
import { prisma } from "~/server/db";

const handler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse<undefined>
) => {
  if (req.method === "POST") {
    const {
      departure,
      arrival,
      portOfLoading,
      portOfDischarge,
      vessel
    } = req.body;

    const createdVoyage = await prisma.voyage.create({
      data: {
        scheduledDeparture: departure,
        scheduledArrival: arrival,
        portOfLoading,
        portOfDischarge,
        vesselId: vessel,
      }
    });

    createdVoyage ? res.status(201) : res.status(500);
    res.end();
    return;
  }

  res.status(405).end();
};

export default handler;
