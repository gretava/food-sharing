import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getValidSessionByToken } from '../../../../database/sessions';
import { getUsersWithLimitAndOffsetBySessionToken } from '../../../../database/users';

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  // password_hash: string;
};

export type Error = {
  error: string;
};

type UsersResponseBodyGet = { users: User[] } | Error;

const userSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
});

export async function GET(
  request: NextRequest,
): Promise<NextResponse<UsersResponseBodyGet>> {
  const { searchParams } = new URL(request.url);

  // 1. get the token from the cookie
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the token has a valid session
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  console.log('This comes from the API', session);

  if (!session) {
    return NextResponse.json(
      {
        error: 'session token is not valid',
      },
      { status: 401 },
    );
  }

  const limit = Number(searchParams.get('limit'));
  const offset = Number(searchParams.get('offset'));

  if (!limit || !offset) {
    return NextResponse.json(
      {
        error: 'Limit and Offset need to be passed as params',
      },
      { status: 400 },
    );
  }

  // query the database to get all the users only if a valid session token is passed
  const users = await getUsersWithLimitAndOffsetBySessionToken(
    limit,
    offset,
    sessionTokenCookie.value,
  );

  return NextResponse.json({ users: users });
}
