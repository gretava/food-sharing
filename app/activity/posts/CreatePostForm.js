'use client';

export default function CreatePostForm() {
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
