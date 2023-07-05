import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@website/server/database/index';
import { auth } from '@website/server/lucia/index';

export const GET = async (request: NextRequest) => {
  const authRequest = auth.handleRequest({ request, cookies });
  const { user } = await authRequest.validateUser();

  if (!user) {
    return NextResponse.json(null, {
      status: 401,
    });
  }

  const response = await db.query.user.findFirst({
    where: (table, { eq }) => eq(table.handle, user.handle),
    columns: {},
    with: {
      profile: true,
    },
  });

  return NextResponse.json(response ? { ...response.profile } : null);
};
