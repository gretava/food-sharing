'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignupResponseBodyPost } from '../../api/(auth)/signup/route';
import styles from './signupForm.module.scss';

export default function SignupForm() {
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function signup() {
    const response = await fetch('/api/signup', {
      method: 'POST',
      body: JSON.stringify({ firstname, lastname, username, password }),
    });

    const data: SignupResponseBodyPost = await response.json();

    if ('error' in data) {
      setError(data.error);
      return;
    }

    // router.push(`/profile/${data.user.username}`);
    router.push(`/profile`);
    // we may have in the future revalidatePath()
    router.refresh();
  }

  return (
    <main className={styles.backroundArea}>
      <div className={styles.signupText}>
        <h2 className={styles.h}>Create Account</h2>
      </div>
      <form onSubmit={(event) => event.preventDefault()}>
        <div className={styles.signupArea}>
          <label>
            First name:
            <input
              className={styles.input}
              value={firstname}
              onChange={(event) => setFirstname(event.currentTarget.value)}
            />
          </label>
          <label>
            Last name:
            <input
              className={styles.input}
              value={lastname}
              onChange={(event) => setLastname(event.currentTarget.value)}
            />
          </label>
          <label>
            Username:
            <input
              className={styles.input}
              value={username}
              onChange={(event) => setUsername(event.currentTarget.value)}
            />
          </label>
          <label>
            Password:
            <input
              type="password"
              className={styles.input}
              value={password}
              onChange={(event) => setPassword(event.currentTarget.value)}
            />
          </label>
        </div>
        <section className={styles.signupBtnForm}>
          <button className={styles.btn} onClick={async () => await signup()}>
            Signup
          </button>
          {error !== '' && <div>{error}</div>}
        </section>
      </form>
    </main>
  );
}
