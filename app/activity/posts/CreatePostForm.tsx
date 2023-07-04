'use client';

import { useState } from 'react';
import { Post } from '../../../migrations/1688030244-createTablePosts';

type Props = {
  posts: Post[];
  userId: number;
};

export default function CreatePostForm({ userId, posts }: Props) {
  const [postList, setPostList] = useState(posts);
  // const [userid, setUserid] = useState(post.id);
  // const [postCreateDate, setPostCreateDate] = useState();
  const [postContent, setPostContent] = useState('');

  async function createPost() {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        content: postContent,
        // createdAt: postCreateDate,
      }),
    });

    const data = await response.json();
    console.log(data);
    // setPostCreateDate(data.post.createdAt);
    // setPostList([...postList, data.post]);
  }

  // postList.map((post) => {
  return (
    // <div key={`post-content-${post.id}`}>
    <div>
      <br />

      <textarea
        value={postContent}
        onChange={(event) => setPostContent(event.currentTarget.value)}
        placeholder="Say something..."
      />
      <button onClick={async () => await createPost()}>Post</button>
    </div>
  );
  // });
}

// 1. create API route to insert post
// 2. get body from textarea and user id from session cookie
// 3. call a function to insert the data into database
