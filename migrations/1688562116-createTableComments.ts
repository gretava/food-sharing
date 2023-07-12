import { Sql } from 'postgres';

export type Comment = {
  id: number;
  post_id: number;
  user_id: number;
  content: string;
  created_at: Date;
};

export async function up(sql: Sql) {
  await sql`
    CREATE TABLE comments (
      id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
      post_id integer NOT NULL REFERENCES posts (id) ON DELETE CASCADE,
      user_id integer NOT NULL REFERENCES users (id),
      content varchar(600) NOT NULL,
      created_at timestamp NOT NULL DEFAULT NOW()
    )
  `;
}

export async function down(sql: Sql) {
  await sql`
    DROP TABLE comments
  `;
}
