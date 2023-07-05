import { NextRequest, NextResponse } from 'next/server';
import { getCommentById } from '../../../../database/comments';
import { Comment } from '../../../../migrations/1688562116-createTableComments';

export type Error = {
  error: string;
};

type CommentResponseBodyGet = { comment: Comment } | Error;

export async function GET(
  request: NextRequest,
  { params }: { params: Record<string, string | string[]> },
): Promise<NextResponse<CommentResponseBodyGet>> {
  const commentId = Number(params.commentId);

  if (!commentId) {
    return NextResponse.json(
      {
        error: 'Comment ID is not valid',
      },
      { status: 400 },
    );
  }
  // query the database to get all the comments
  const comment = await getCommentById(commentId);

  if (!comment) {
    return NextResponse.json(
      {
        error: 'Post Not Found',
      },
      { status: 404 },
    );
  }

  return NextResponse.json({ comment: comment });
}
