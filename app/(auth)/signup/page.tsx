import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { IoArrowBackOutline } from 'react-icons/io5';
import { getValidSessionByToken } from '../../../database/sessions';
import SignupForm from './SignupForm';

export default async function SignupPage() {
  // if the user is logged in redirect

  // 1. Check if the sessionToken cookie exit
  const sessionTokenCookie = cookies().get('sessionToken');
  // 2. check if the sessionToken has a valid session
  const session =
    sessionTokenCookie &&
    (await getValidSessionByToken(sessionTokenCookie.value));

  // 3. Either redirect or render the login form
  if (session) redirect('/activity');

  return <SignupForm />;
}
