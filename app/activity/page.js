import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../database/sessions';
import CommentForm from './comments/CommentForm';
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

  return (
    <main>
      <h1>This is activity page</h1>
      <h4>Post or comment here</h4>
      {/* <CommentForm /> */}
      <CreatePostForm />
    </main>
  );
}
