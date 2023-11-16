import { cookies } from 'next/headers';
// import Image from 'next/image';
import { notFound, redirect } from 'next/navigation';
import { getValidSessionByToken } from '../../database/sessions';
import { getUserBySessionToken } from '../../database/users';
// import styles from './page.module.scss';
import ProfileForm from './ProfileForm';

type Props = {
  params: { username: string };
};

export default async function UserProfilePage({ params }: Props) {
  // export default async function UserProfilePage() {
  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');

  // 2. check if the sessionToken has a valid session

  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (!session) redirect('/?returnTo=/profile');

  const user = await getUserBySessionToken(session.token);
  console.log(user);

  // const testusers = await getUserById(15);
  // console.log(testusers);

  if (!user) {
    notFound();
  }
  // console.log(user);
  console.log('this', user);

  return (
    <main>
      <ProfileForm user={user} />
    </main>
  );
}
