import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getAllPosts } from '../../database/posts';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken } from '../../database/users';
import CreateCommentForm from './comments/CreateCommentForm';
// import CommentForm from './comments/CommentForm';
import CreatePostForm from './posts/CreatePostForm';

export default async function ActivityPage() {
  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (!session) redirect('/?returnTo=/activity');

  const user = await getUserBySessionToken(session.token);
  console.log(user);

  if (!user) {
    notFound();
  }

  const posts = await getAllPosts();
  console.log(posts);
  return (
    <main>
      <h1>This is activity page</h1>
      <h4>Post or comment here</h4>
      <CreatePostForm userId={user.id} />
      {/* {JSON.stringify(posts)} */}
      {posts.map((post) => (
        <div key={`post-content-${post.id}`}>
          {post.content} <CreateCommentForm />
        </div>
      ))}
    </main>
  );
}
