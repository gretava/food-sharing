import './globals.scss';
import { Montserrat } from 'next/font/google';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ReactNode } from 'react';
import { CgProfile } from 'react-icons/cg';
import { GrHomeRounded } from 'react-icons/gr';
import { getUserBySessionToken } from '../database/users';
import { LogoutButton } from './(auth)/logout/LogoutButton';
import styles from './layout.module.scss';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata = {
  title: 'waste not | connect, share and reduce food waste',
  description: 'Connecting like-minded individuals through food sharing',
};

type Props = {
  children: ReactNode;
};

export default async function RootLayout({ children }: Props) {
  // 1. get the session token from the cookie
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('sessionToken');

  const user = !sessionToken?.value
    ? undefined
    : await getUserBySessionToken(sessionToken.value);

  return (
    <html lang="en">
      <body className={montserrat.className}>
        <div className={styles.backgroundcolor}>
          {user ? (
            <div className={styles.profileNavbar}>
              <div>
                <Link href="/activity">
                  <GrHomeRounded size="1.65rem" />
                </Link>
              </div>
              <div>
                {/* how to get firstname here? user.firstname */}
                {/* <span className={styles.helloUsername}>Hello, </span> */}
                <Link className={styles.helloUsername} href="/profile">
                  <CgProfile size="1.8rem" color="#000" />
                </Link>
              </div>
              <span>
                <LogoutButton />
              </span>
            </div>
          ) : (
            <div>
              {/* <Link href="/login">Log in</Link>
              <br />
              <Link href="/signup">Sign up</Link> */}
            </div>
          )}
        </div>
        {children}
      </body>
    </html>
  );
}
