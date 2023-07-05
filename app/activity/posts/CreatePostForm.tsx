'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Post } from '../../../migrations/1688030244-createTablePosts';

type Props = {
  posts: Post[];
  userId: number;
};

export default function CreatePostForm({ userId, posts }: Props) {
  const [postList, setPostList] = useState(posts);
  // const [userid, setUserid] = useState(post.id);
  const [postContent, setPostContent] = useState('');

  const router = useRouter();

  async function createPost() {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        content: postContent,
      }),
    });
    router.refresh();

    const data = await response.json();
    console.log(data);
    // setPostList([...postList, data.post]);

    setPostContent('');
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div>
        <br />
        <textarea
          value={postContent}
          onChange={(event) => setPostContent(event.currentTarget.value)}
          placeholder="Say something..."
        />
        <button onClick={async () => await createPost()}>Post</button>
      </div>
    </form>
  );
}
