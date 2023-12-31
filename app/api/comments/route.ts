import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createComment,
  getAllComments,
  getCommentsByPostId,
} from '../../../database/comments';
import { getUserBySessionToken } from '../../../database/users';
import { Comment } from '../../../migrations/1688562116-createTableComments';

export type Error = {
  error: string;
};

type CommentsResponseBodyGet = { comments: Comment[] } | Error;
type CommentsResponseBodyPost = { comments: Comment } | Error;

const commentSchema = z.object({
  postId: z.number(),
  userId: z.number(),
  content: z.string(),
});

export async function GET(
  request: NextRequest,
): Promise<NextResponse<CommentsResponseBodyGet>> {
  const { searchParams } = new URL(request.url);

  // 1. get the token from the cookie
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the token has a valid session
  // const session =
  //   sessionTokenCookie &&
  //   (await getValidSessionByToken(sessionTokenCookie.value));

  const userSession =
    sessionTokenCookie &&
    (await getUserBySessionToken(sessionTokenCookie.value));

  console.log('This comes from the API', userSession);

  if (!userSession) {
    return NextResponse.json(
      {
        error: 'Session token is not valid',
      },
      { status: 401 },
    );
  }

  // const limit = Number(searchParams.get('limit'));
  // const offset = Number(searchParams.get('offset'));

  // if (!limit || !offset) {
  //   return NextResponse.json(
  //     {
  //       error: 'Limit and Offset need to be passed as params',
  //     },
  //     { status: 400 },
  //   );
  // }

  // query the database to get all the animals only if a valid session token is passed
  // const comments = await getPostsWithLimitAndOffsetBySessionToken(
  //   limit,
  //   offset,
  //   sessionTokenCookie.value,
  // );

  // call db and get the posts
  const getComments = await getAllComments();
  // const commentsByPostId = await getCommentsByPostId();

  // console.log('here', comments);

  return NextResponse.json({ comments: getComments });
  // return NextResponse.json({ comments: commentsByPostId });
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<CommentsResponseBodyPost>> {
  // 1. get the token from the cookie
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the token has a valid session
  // const session =
  //   sessionTokenCookie &&
  //   (await getValidSessionByToken(sessionTokenCookie.value));

  const userSession =
    sessionTokenCookie &&
    (await getUserBySessionToken(sessionTokenCookie.value));

  if (!userSession) {
    return NextResponse.json(
      {
        error: 'Session token is not valid',
      },
      { status: 401 },
    );
  }
  const body = await request.json();
  console.log(body);

  // zod please verify the body matches my schema
  const result = commentSchema.safeParse(body);

  if (!result.success) {
    // zod send you details about the error
    console.log(result.error);
    return NextResponse.json(
      {
        error: 'The data is incomplete',
      },
      { status: 400 },
    );
  }
  // query the database to get all the posts
  const newComment = await createComment(
    result.data.postId,
    result.data.userId,
    result.data.content,
  );

  if (!newComment) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'Error creating the new post',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ comments: newComment });
}
