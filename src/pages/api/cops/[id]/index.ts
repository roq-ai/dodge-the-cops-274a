import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { copValidationSchema } from 'validationSchema/cops';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.cop
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getCopById();
    case 'PUT':
      return updateCopById();
    case 'DELETE':
      return deleteCopById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getCopById() {
    const data = await prisma.cop.findFirst(convertQueryToPrismaUtil(req.query, 'cop'));
    return res.status(200).json(data);
  }

  async function updateCopById() {
    await copValidationSchema.validate(req.body);
    const data = await prisma.cop.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteCopById() {
    const data = await prisma.cop.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
