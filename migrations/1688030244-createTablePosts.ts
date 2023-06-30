import { Sql } from 'postgres';

export type Post = {
  id: number;
  user_id: number;
  content: string; // Do I need image url, if users post a pic?
  created_at: string; // what type is this?
  // updated_at: string; // what type is this?
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE posts (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      user_id integer NOT NULL REFERENCES users (id),
      content varchar(600) NOT NULL,
      created_at timestamp NOT NULL DEFAULT NOW()
      -- updated_at timestamp NOT NULL DEFAULT NOW()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE posts
  `;
}
