'use client';

import { Route } from 'next';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { getSafeReturnToPath } from '../../../util/validation';
import { LoginResponseBodyPost } from '../../api/(auth)/login/route';
import styles from './loginForm.module.scss';

type Props = { returnTo?: string | string[] };

export default function LoginForm(props: Props) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function login() {
    const response = await fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });

    const data: LoginResponseBodyPost = await response.json();

    if ('error' in data) {
      setError(data.error);
      console.log(data.error);
      return;
    }

    router.push(
      getSafeReturnToPath(props.returnTo) ||
        // (`/profile/${data.user.username}` as Route),
        (`/activity/` as Route),
    );
    // we may have in the future revalidatePath()
    router.refresh();
  }

  return (
    <main className={styles.backroundArea}>
      {/* <section className={styles.section}> */}
      <div className={styles.loginText}>
        <h2 className={styles.h}>Login</h2>
        <p className={styles.p}>Please login to continue</p>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className={styles.loginArea}>
          <label>
            username
            <input
              className={styles.input}
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
          </label>
          <br />
          <label>
            password
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </label>
        </div>
        <section className={styles.loginBtnForm}>
          {/* <div className={styles.loginBtn}> */}
          <button className={styles.btn} onClick={async () => await login()}>
            login
          </button>
          {/* </div> */}
          {error !== '' && <div>{error}</div>}
        </section>
        {/* </section> */}
      </form>
    </main>
  );
}
