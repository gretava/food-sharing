'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SignupResponseBodyPost } from '../../api/(auth)/signup/route';

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
    <form onSubmit={(event) => event.preventDefault()}>
      <label>
        First name:
        <input
          value={firstname}
          onChange={(event) => setFirstname(event.currentTarget.value)}
        />
      </label>
      <label>
        Last name:
        <input
          value={lastname}
          onChange={(event) => setLastname(event.currentTarget.value)}
        />
      </label>
      <label>
        Username:
        <input
          value={username}
          onChange={(event) => setUsername(event.currentTarget.value)}
        />
      </label>
      <label>
        Password:
        <input
          value={password}
          onChange={(event) => setPassword(event.currentTarget.value)}
        />
      </label>
      <button onClick={async () => await signup()}>Sign up</button>
      {error !== '' && <div>{error}</div>}
    </form>
  );
}
