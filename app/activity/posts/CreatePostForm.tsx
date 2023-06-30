'use client';

import { useState } from 'react';
import { Post } from '../../../migrations/1688030244-createTablePosts';

type Props = {
  posts: Post[];
};

export default function CreatePostForm({ posts }: Props) {
  const [postList, setPostList] = useState(posts);
  const [postContent, setPostContent] = useState('');

  async function createPost() {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        content: postContent,
      }),
    });

    const data = await response.json();

    setPostList([...postList, data.post]);
  }

  return (
    <>
      <textarea placeholder="Say something..." />
      <button>Post</button>
    </>
  );
}

// 1. create API route to insert post
// 2. get body from textarea and user id from session cookie
// 3. call a function to insert the data into database
