import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  createPost,
  getAllPosts,
  getPostsWithLimitAndOffsetBySessionToken,
} from '../../../../database/posts';
import { getUserBySessionToken } from '../../../../database/users';
// import { getValidSessionByToken } from '../../../../database/sessions';
import { Post } from '../../../../migrations/1688030244-createTablePosts';

// export type Post = {
//   id: number;
//   userId: number;
//   content: string;
// };

export type Error = {
  error: string;
};

// export type CreatePost =
//   | {
//       post: Post;
//     }
//   | Error;

type PostsResponseBodyGet = { posts: Post[] } | Error;
type PostsResponseBodyPost = { posts: Post } | Error;

const postSchema = z.object({
  // id: z.number(),
  userId: z.number(),
  content: z.string(),
  // createdAt: z.string(),
  // session: z.string(),
});

export async function GET(
  request: NextRequest,
): Promise<NextResponse<PostsResponseBodyGet>> {
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

  // query the database to get all the animals only if a valid session token is passed
  const posts = await getPostsWithLimitAndOffsetBySessionToken(
    limit,
    offset,
    sessionTokenCookie.value,
  );

  // call db and get the posts
  const getPosts = await getAllPosts();
  console.log('here', posts);

  return NextResponse.json({ posts: getPosts });
}

export async function POST(
  request: NextRequest,
): Promise<NextResponse<PostsResponseBodyPost>> {
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
  const result = postSchema.safeParse(body);

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
  const newPost = await createPost(
    // Number(result.data.userId),
    result.data.userId,
    result.data.content,
    // result.data.createdAt,
    // session.id,
  );

  if (!newPost) {
    // zod send you details about the error
    // console.log(result.error);
    return NextResponse.json(
      {
        error: 'Error creating the new post',
      },
      { status: 500 },
    );
  }

  return NextResponse.json({ posts: newPost });
}
