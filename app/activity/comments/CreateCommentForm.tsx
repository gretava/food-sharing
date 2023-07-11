'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  comments: Comment[];
  postId: number;
  userId: number;
};

export default function CreateCommentForm({ postId, userId, comments }: Props) {
  const [commentContent, setCommentContent] = useState('');
  const router = useRouter();

  async function createComment() {
    const response = await fetch(`/api/comments`, {
      method: 'POST',
      body: JSON.stringify({
        postId,
        userId,
        content: commentContent,
      }),
    });
    router.refresh();

    const data = await response.json();
    console.log(data);

    setCommentContent('');
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div>
        <textarea
          value={commentContent}
          onChange={(event) => setCommentContent(event.currentTarget.value)}
          placeholder="Reply"
        />
        <button onClick={async () => await createComment()}>Reply</button>
      </div>
    </form>
  );
}
