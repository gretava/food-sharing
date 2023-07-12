import { Sql } from 'postgres';

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  username: string;
  bio?: string;
  profileImgUrl?: string;
  // Omit passwordHash for security
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE users (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      firstname varchar(30) NOT NULL,
      lastname varchar(30) NOT NULL,
      username varchar(100) NOT NULL UNIQUE,
      bio varchar(500),
      profile_img_url varchar(250),
      password_hash varchar(100) NOT NULL
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE users
  `;
}
