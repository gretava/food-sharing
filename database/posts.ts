import { cache } from 'react';
import { Post } from '../migrations/1688030244-createTablePosts';
import { sql } from './connect';

export const createPost = cache(
  async (userId: number, content: string, session: number) => {
    const [post] = await sql<Post[]>`
    INSERT INTO posts
      (userId, content, session)
    VALUES
      (${userId}, ${content}, ${session})
    RETURNING
      id,
      userId,
      content,
      session
 `;

    return post;
  },
);

export const getPostById = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
    WHERE
      id = ${id}
  `;
  return post;
});

export const getAllPosts = cache(async () => {
  const [post] = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
  `;
  return post;
});
