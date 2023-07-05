import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import { cookies } from 'next/headers';
// import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createSession } from '../../../../database/sessions';
import { createUser, getUserByUsername } from '../../../../database/users';
import { User } from '../../../../migrations/1687188335-createUsersTable';
import { secureCookieOptions } from '../../../../util/cookies';

type Error = {
  error: string;
};

export type SignupResponseBodyPost =
  | {
      user: User;
    }
  | Error;

const userSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
  // profile_img_url: z.string().min(1), // Do I need this?
});

export async function POST(
  request: NextRequest,
): Promise<NextResponse<SignupResponseBodyPost>> {
  const body = await request.json();

  // console.log(body);

  // 1. get the credentials from the body
  const result = userSchema.safeParse(body);

  // 2. verify the user data and check that the name is not taken
  if (!result.success) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'username or password missing',
      },
      { status: 400 },
    );
  }

  // console.log('query', await getUserByUsername(result.data.username));
  if (await getUserByUsername(result.data.username)) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'username is already used',
      },
      { status: 406 },
    );
  }

  // 3. hash the password
  const passwordHash = await bcrypt.hash(result.data.password, 10);

  // 4. store the credentials in the db

  const newUser = await createUser(
    result.data.firstname,
    result.data.lastname,
    result.data.username,
    passwordHash,
    // result.data.profile_img_url,
  );

  if (!newUser) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'Error creating new user',
      },
      { status: 500 },
    );
  }

  // We are sure the user is authenticated

  // 5. Create a token
  const token = crypto.randomBytes(100).toString('base64');

  // 6. Create the session record
  const session = await createSession(token, newUser.id);
  // console.log(session);

  if (!session) {
    return NextResponse.json(
      {
        error: 'Error creating the new session',
      },
      { status: 500 },
    );
  }

  // 7. Send the new cookie in the headers
  cookies().set({
    name: 'sessionToken',
    value: session.token,
    ...secureCookieOptions,
  });

  return NextResponse.json({
    user: newUser,
  });
}
