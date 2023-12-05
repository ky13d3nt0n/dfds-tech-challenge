import type { Vessel, Voyage, UnitType } from "@prisma/client";
import type { NextApiHandler, NextApiResponse } from "next";
import { prisma } from "~/server/db";

export type ReturnType = (UnitType)[];

const handler: NextApiHandler = async (_, res: NextApiResponse<ReturnType>) => {
  const unitTypes = await prisma.unitType.findMany();

  res.status(200).json(unitTypes);
};

export default handler;
