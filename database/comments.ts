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
    -- user_id = comment_id
    user_id = post_id
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

export const getAllComments = cache(async () => {
  const comments = await sql<Comment[]>`
    SELECT
      *
    FROM
      comments
  `;
  return comments;
});

export const deleteCommentById = cache(async (id: number) => {
  const [comment] = await sql<Comment[]>`
    DELETE FROM
      comments
    WHERE
      id = ${id}
    RETURNING *
  `;
  return comment;
});

// type PostsFromUsers = {
//   commentId: number;
//   commentContent: string;
//   userId: number;
//   username: string;
//   // userImageUrl: string;
// };

export const getAllCommentsWithUserInfo = cache(async () => {
  const commentsWithUserInfo = await sql<commentsWithUserInfo[]>`
    SELECT
      comments.id AS comment_id,
      comments.post_id AS post_id,
      comments.content AS content,
      users.id AS user_id,
      users.username AS username
    FROM
      comments
    INNER JOIN
      users ON comments.user_id = users.id
  `;
  return commentsWithUserInfo;
});
