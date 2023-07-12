import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  deleteUserById,
  getUserById,
  updateUserById,
} from '../../../../../database/users';
import { Error, User } from '../route';

type UserResponseBodyGet = { user: User } | Error;
type UserResponseBodyDelete = { user: User } | Error;
type UserResponseBodyPut = { user: User } | Error;

const userSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  username: z.string(),
  bio: z.string().optional(),
  profileImgUrl: z.string().optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<UserResponseBodyGet>> {
  const userId = Number(params.userId);

  if (!userId) {
    return NextResponse.json(
      {
        error: 'User ID is not valid',
      },
      { status: 400 },
    );
  }
  // query the database to get all the users
  const user = await getUserById(userId);

  if (!user) {
    return NextResponse.json(
      {
        error: 'User Not Found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ user: user });
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<UserResponseBodyDelete>> {
  const userId = Number(params.userId);

  if (!userId) {
    return NextResponse.json(
      {
        error: 'User ID is not valid',
      },
      { status: 400 },
    );
  }
  // query the database to get all the users
  const user = await deleteUserById(userId);

  if (!user) {
    return NextResponse.json(
      {
        error: 'User Not Found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ user: user });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<UserResponseBodyPut>> {
  const userId = Number(params.userId);
  const body = await request.json();

  if (!userId) {
    return NextResponse.json(
      {
        error: 'User ID is not valid',
      },
      { status: 400 },
    );
  }

  // zod please verify the body matches my schema
  const result = userSchema.safeParse(body);

  if (!result.success) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'The data is incomplete',
      },
      { status: 400 },
    );
  }
  // query the database to update the user
  const user = await updateUserById(
    userId,
    result.data.firstname,
    result.data.lastname,
    result.data.username,
    result.data.bio!,
    result.data.profileImgUrl!,
  );

  if (!user) {
    return NextResponse.json(
      {
        error: 'User Not Found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    user: user,
  });
}
