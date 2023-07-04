import { cookies } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken } from '../../database/users';
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

  return (
    <main>
      <h1>This is activity page</h1>
      <h4>Post or comment here</h4>
      {/* <CommentForm /> */}
      <CreatePostForm userId={user.id} />
    </main>
  );
}
