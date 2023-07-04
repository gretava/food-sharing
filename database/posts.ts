import { cache } from 'react';
import { Post } from '../migrations/1688030244-createTablePosts';
import { sql } from './connect';

export const createPost = cache(async (userId: number, content: string) => {
  const [post] = await sql<Post[]>`
    INSERT INTO posts
      (user_id, content) -- deleted session
    VALUES
      (${userId}, ${content}) -- deleted session
    RETURNING
      id,
      userId,
      content
      -- createdAt
      -- session
 `;

  return post;
});

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
  const posts = await sql<Post[]>`
    SELECT
      *
    FROM
      posts
  `;
  return posts;
});

export const getPostsWithLimitAndOffsetBySessionToken = cache(
  async (limit: number, offset: number, token: string) => {
    const posts = await sql<Post[]>`
      SELECT
        posts.*
      FROM
        posts
      INNER JOIN
        sessions ON (
          sessions.token = ${token} AND
          sessions.expiry_timestamp > now()
          sessions.user_id = posts.user_id
        )
      -- This would JOIN the users table that is related to animals
      -- INNER JOIN
      --   users ON (
      --     users.id = animals.user_id AND
      --     sessions.user_id = users.id
      --   )
      LIMIT ${limit}
      OFFSET ${offset}
    `;

    return posts;
  },
);
