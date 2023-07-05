import { cache } from 'react';
import { Comment } from '../migrations/1688562116-createTableComments';
import { sql } from './connect';

export const createComment = cache(
  async (postId: number, userId: number, content: string) => {
    const [comment] = await sql<Comment[]>`
    INSERT INTO comments
      (post_id, user_id, content)
    VALUES
      (${postId}, ${userId}, ${content})
    RETURNING
      id,
      post_id,
      user_id,
      content
 `;

    return comment;
  },
);

export const getCommentsByPostId = cache(async () => {
  const comments = await sql<Comment[]>`
  SELECT
    *
  FROM
    comments
  WHERE
    user_id = 'comment_id'
  `;
  return comments;
});

export const getAllComments = cache(async () => {
  const comments = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
  `;
  return comments;
});

export const getCommentById = cache(async (id: number) => {
  const [comment] = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
    WHERE
      id = ${id}
  `;
  return comment;
});
