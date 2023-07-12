'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Post } from '../../../migrations/1688030244-createTablePosts';

type Props = {
  // posts: Post[];
  postId: number;
  // userId: number;
};

export function DeletePostButton({ postId }: Props) {
  const router = useRouter();
  // const [postList, setPostList] = useState(posts);

  async function deletePostById(id: number) {
    const response = await fetch(`/api/posts/${id}`, {
      method: 'DELETE',
    });

    const data = await response.json();
    router.refresh();

    // setPostList(postList.filter((post) => post.id !== data.post.id));
  }

  return <button onClick={async () => await deletePostById(postId)}>x</button>;
}
