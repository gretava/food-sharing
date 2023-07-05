import { NextRequest, NextResponse } from 'next/server';
import { getPostById } from '../../../../../database/posts';
import { Post } from '../../../../../migrations/1688030244-createTablePosts';

export type Error = {
  error: string;
};

type PostResponseBodyGet = { post: Post } | Error;

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<PostResponseBodyGet>> {
  const postId = Number(params.postId);

  if (!postId) {
    return NextResponse.json(
      {
        error: 'Post ID is not valid',
      },
      { status: 400 },
    );
  }
  // query the database to get all the posts
  const post = await getPostById(postId);

  if (!post) {
    return NextResponse.json(
      {
        error: 'Post Not Found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ post: post });
}
