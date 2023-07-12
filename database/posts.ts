import { cache } from 'react';
import { Post } from '../migrations/1688030244-createTablePosts';
import { sql } from './connect';

export const createPost = cache(
  async (userId: number, content: string, imageUrl: string) => {
    const [post] = await sql<Post[]>`
    INSERT INTO posts
      (user_id, content, image_url) -- deleted session
    VALUES
      (${userId}, ${content}, ${imageUrl}) -- deleted session
    RETURNING
      id,
      user_id,
      content,
      image_url
      -- createdAt
      -- session
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

export const deletePostById = cache(async (id: number) => {
  const [post] = await sql<Post[]>`
    DELETE FROM
      posts
    WHERE
      id = ${id}
    RETURNING
      *
  `;
  return post;
});

export const getAllPostsWithUserInfo = cache(async () => {
  const postsFromUser = await sql<PostsFromUsers[]>`
  SELECT
    posts.id AS post_id,
    users.id AS user_id,
    users.username AS username,
    posts.content AS content,
    posts.image_url AS image_url
    -- users.image_url AS user_image_url
  FROM
    posts
  INNER JOIN
    users ON posts.user_id = users.id
  `;
  return postsFromUser;
});
