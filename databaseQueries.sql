-- This file is only my notes, changing
-- this file doesn't change anything in
-- the database

-- Create animals table
CREATE TABLE users (
  id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  firstname varchar(30) NOT NULL,
  lastname varchar(30) NOT NULL,
  username varchar(100) NOT NULL,
  password_hash varchar(100) NOT NULL,
  -- profile_img_url varchar(100)
);

-- Insert some animals (C in CRUD - Create)
INSERT INTO users
  (firstname, lastname, username, password_hash)

VALUES


SELECT * FROM users;
