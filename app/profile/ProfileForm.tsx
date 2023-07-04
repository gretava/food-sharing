'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type Props = {
  user: {
    id: number;
    firstname: string;
    lastname: string;
    username: string;
  };
};

export default function ProfileForm({ user }: Props) {
  const [firstnameInput, setFirstnameInput] = useState(user.firstname);
  const [lastnameInput, setLastnameInput] = useState(user.lastname);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [onEditId, setOnEditId] = useState<number>();
  const router = useRouter();

  // only for on edit inputs
  const [onEditFirstnameInput, setOnEditFirstnameInput] = useState('');
  const [onEditLastnameInput, setOnEditLastnameInput] = useState('');
  const [onEditUsernameInput, setOnEditUsernameInput] = useState('');

  async function updateUserById(id: number) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstname: onEditFirstnameInput,
        lastname: onEditLastnameInput,
        username: onEditUsernameInput,
      }),
    });
    router.refresh();
    const data = await response.json();

    console.log(data.user);
    setFirstnameInput(data.user.firstname);
    setLastnameInput(data.user.lastname);
    setUsernameInput(data.user.username);
  }

  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <label>
        First Name
        <input
          value={user.id !== onEditId ? firstnameInput : onEditFirstnameInput}
          onChange={(event) =>
            setOnEditFirstnameInput(event.currentTarget.value)
          }
          disabled={user.id !== onEditId}
        />
      </label>
      <label>
        Last Name
        <input
          value={user.id !== onEditId ? lastnameInput : onEditLastnameInput}
          onChange={(event) =>
            setOnEditLastnameInput(event.currentTarget.value)
          }
          disabled={user.id !== onEditId}
        />
      </label>
      <label>
        Username
        <input
          value={user.id !== onEditId ? usernameInput : onEditUsernameInput}
          onChange={(event) =>
            setOnEditUsernameInput(event.currentTarget.value)
          }
          disabled={user.id !== onEditId}
        />
      </label>

      {user.id === onEditId ? (
        <button
          onClick={async () => {
            setOnEditId(undefined);
            await updateUserById(user.id);
          }}
        >
          save
        </button>
      ) : (
        <button
          onClick={() => {
            setOnEditId(user.id);
            setOnEditFirstnameInput(user.firstname);
            setOnEditLastnameInput(user.lastname);
            setOnEditUsernameInput(user.username);
          }}
        >
          edit
        </button>
      )}
    </form>
  );
}
