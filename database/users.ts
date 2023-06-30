import { cache } from 'react';
import { User } from '../migrations/1687188335-createUsersTable';
import { sql } from './connect';

type UserWithPasswordHash = User & {
  passwordHash: string;
};

// export type User = {
//   id: number;
//   firstname: string;
//   lastname: string;
//   username: string;
//   passwordHash: string;
// }

export const getUsers = cache(async () => {
  const users = await sql<User[]>`
    SELECT * FROM users
 `;

  return users;
});

export const getUserWithPasswordHashByUsername = cache(
  async (username: string) => {
    const [user] = await sql<UserWithPasswordHash[]>`
    SELECT * FROM
      users
    WHERE
      users.username = ${username.toLowerCase()}
 `;

    return user;
  },
);

export const getUserByUsername = cache(async (username: string) => {
  const [user] = await sql<User[]>`
    SELECT
      id,
      firstname,
      lastname,
      username
      -- profile_img_url
    FROM
      users
    WHERE
      users.username = ${username.toLowerCase()}
 `;

  return user;
});

export const createUser = cache(
  async (
    firstname: string,
    lastname: string,
    username: string,
    // profileImgUrl: string,
    passwordHash: string,
  ) => {
    // console.log(passwordHash);
    const [user] = await sql<User[]>`
    INSERT INTO users
      (firstname, lastname, username, password_hash)
    VALUES
      (${firstname}, ${lastname}, ${username.toLowerCase()}, ${passwordHash})
    RETURNING
      id,
      firstname,
      lastname,
      username
      -- profile_img_url
 `;

    return user;
  },
);

export const getUserById = cache(async (id: number) => {
  const [user] = await sql<User[]>`
    SELECT
      *
    FROM
      users
    WHERE
      id = ${id}
  `;
  return user;
});

export const updateUserById = cache(
  async (id: number, firstname: string, lastname: string, username: string) => {
    const [user] = await sql<User[]>`
      UPDATE users
      SET
        firstname = ${firstname},
        lastname = ${lastname},
        username = ${username}
      WHERE
        id = ${id}
        RETURNING *
    `;

    return user;
  },
);

export const deleteUserById = cache(async (id: number) => {
  const [user] = await sql<User[]>`
    DELETE FROM
      users
    WHERE
      id = ${id}
    RETURNING *
  `;
  return user;
});

export const getUserBySessionToken = cache(async (token: string) => {
  const [user] = await sql<User[]>`
  SELECT
    users.id,
    users.username,
    users.firstname,
    users.lastname
  FROM
    users
  INNER JOIN
    sessions ON (
      sessions.token = ${token} AND
      sessions.user_id = users.id AND
      sessions.expiry_timestamp > now()
    )
  `;

  return user;
});

export const getUsersWithLimitAndOffsetBySessionToken = cache(
  async (limit: number, offset: number, token: string) => {
    const users = await sql<User[]>`
      SELECT
        users.*
      FROM
        users
      INNER JOIN
        sessions ON (
          sessions.token = ${token} AND
          sessions.expiry_timestamp > now()
          -- sessions.user_id = animals.user_id
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

    return users;
  },
);
