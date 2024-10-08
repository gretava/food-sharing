'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Post } from '../../../migrations/1688030244-createTablePosts';
import styles from './createPostForm.module.scss';

type Props = {
  posts: Post[];
  userId: number;
};

export default function CreatePostForm({ userId, posts }: Props) {
  const [postList, setPostList] = useState(posts);
  // const [userid, setUserid] = useState(post.id);
  const [postContent, setPostContent] = useState('');
  const [imageInPostUrl, setImageInPostUrl] = useState<string>('');

  // const fileInputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // change image
  // const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setImageInPostUrl(e.target?.result as string);
  //     };
  //     reader.readAsDataURL(event.target.files[0]);
  //   } else {
  //     setImageInPostUrl(null);
  //   }
  // };

  const handleImageUpload = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'vkncqije');
    const res = await fetch(
      `	https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await res.json();

    setImageInPostUrl(file.secure_url);
  };

  async function createPost() {
    const response = await fetch('/api/posts', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        content: postContent,
        imageUrl: imageInPostUrl,
      }),
    });

    router.refresh();

    const data = await response.json();
    console.log(data);
    // setPostList([...postList, data.post]);

    setPostContent('');
    setImageInPostUrl('');
  }

  // async function deletePostById(id: number) {
  //   const response = await fetch(`/api/posts/${id}`, {
  //     method: 'DELETE',
  //   });

  //   const data = await response.json();

  //   setPostList(postList.filter((post) => post.id !== data.post.id));
  // }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className={styles.postInputField}>
        <textarea
          className={styles.textarea}
          rows={5}
          cols={35}
          value={postContent}
          onChange={(event) => setPostContent(event.currentTarget.value)}
          placeholder="What's on the menu today?"
          required
        />
        <div className={styles.upload}>
          <input
            id="file"
            type="file"
            name="file"
            className={styles.postImgInput}
            placeholder="Upload an image"
            onChange={handleImageUpload}
          />
        </div>
        {/* <div className="w-1/2 mx-auto"> */}
        {/* {loading ? (
                <p>Loading...</p>
              ) : (
                <img src={image} className="mt-4" alt="upload" />
              )} */}
        {/* </div> */}
        <div className={styles.postBtnForm}>
          <button
            className={styles.btnPost}
            onClick={async () => await createPost()}
          >
            Post
          </button>
        </div>
      </div>
    </form>
  );
}
