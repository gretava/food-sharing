'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { User } from '../../migrations/1687188335-createUsersTable';
import styles from './profileForm.module.scss';

type Props = {
  user: User;
};

export default function ProfileForm({ user }: Props) {
  const [firstnameInput, setFirstnameInput] = useState(user.firstname);
  const [lastnameInput, setLastnameInput] = useState(user.lastname);
  const [usernameInput, setUsernameInput] = useState(user.username);
  const [descriptionInput, setDescriptionInput] = useState(user.bio);
  const [profileImageUrl, setProfileImageUrl] = useState(user.profileImgUrl);
  const [onEditId, setOnEditId] = useState<number | undefined>(undefined);
  const router = useRouter();

  // only for on edit inputs
  const [onEditFirstnameInput, setOnEditFirstnameInput] = useState(
    user.firstname,
  );
  const [onEditLastnameInput, setOnEditLastnameInput] = useState(user.lastname);
  const [onEditUsernameInput, setOnEditUsernameInput] = useState(user.username);
  const [onEditDescriptionInput, setOnEditDescriptionInput] = useState(
    user.bio,
  );
  // const [onEditProfileImageUrl, setOnEditProfileImageUrl] = useState('');

  async function updateUserById(id: number) {
    const response = await fetch(`/api/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        firstname: onEditFirstnameInput || '',
        lastname: onEditLastnameInput || '',
        username: onEditUsernameInput || '',
        bio: onEditDescriptionInput || '',
        profileImgUrl: profileImageUrl || '',
      }),
    });

    router.refresh();
    const data = await response.json();

    console.log('here', data);

    setFirstnameInput(data.user.firstname);
    setLastnameInput(data.user.lastname);
    setUsernameInput(data.user.username);
    setDescriptionInput(data.user.bio);
    setProfileImageUrl(data.user.profileImgUrl);
  }

  const handleImageUpload = async (event: any) => {
    const files = event.currentTarget.files;
    const formData = new FormData();
    formData.append('file', files[0]);
    formData.append('upload_preset', 'vkncqije');
    const res = await fetch(
      `	https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDNAME}/upload`,
      {
        method: 'POST',
        body: formData,
      },
    );
    const file = await res.json();

    setProfileImageUrl(file.secure_url);
  };

  return (
    <main className={styles.mainProfileArea}>
      <div>
        <h4 className={styles.h}>Hello, {user.firstname}</h4>
      </div>

      <section className={styles.profileSection}>
        <form onSubmit={(event) => event.preventDefault()}>
          <div className={styles.imageSection}>
            <div className={styles.profileImage}>
              {user.profileImgUrl ? (
                <Image
                  className={styles.profileImage}
                  src={user.profileImgUrl}
                  alt="Profile image"
                  width={180}
                  height={180}
                  priority
                />
              ) : (
                <Image
                  className={styles.profileImage}
                  src="/images/default_user_image.png"
                  alt="avatar"
                  width={180}
                  height={180}
                  priority
                />
              )}
            </div>
            {user.id === onEditId && (
              <div className={styles.profilePicDiv}>
                <input
                  id="file"
                  type="file"
                  name="file"
                  onChange={handleImageUpload}
                  className={styles.profilePicInput}
                />
              </div>
            )}
          </div>

          <div className={styles.userInfoSection}>
            <label className={styles.label}>
              First name
              <input
                className={styles.input}
                value={
                  user.id !== onEditId ? firstnameInput : onEditFirstnameInput
                }
                onChange={(event) =>
                  setOnEditFirstnameInput(event.currentTarget.value)
                }
                disabled={user.id !== onEditId}
              />
            </label>
            <br />
            <label className={styles.label}>
              Last name
              <input
                className={styles.input}
                value={
                  user.id !== onEditId ? lastnameInput : onEditLastnameInput
                }
                onChange={(event) =>
                  setOnEditLastnameInput(event.currentTarget.value)
                }
                disabled={user.id !== onEditId}
              />
            </label>
            <br />
            <label className={styles.label}>
              Username
              <input
                className={styles.input}
                value={
                  user.id !== onEditId ? usernameInput : onEditUsernameInput
                }
                onChange={(event) =>
                  setOnEditUsernameInput(event.currentTarget.value)
                }
                disabled={user.id !== onEditId}
              />
            </label>
            <br />
            <label className={styles.label}>
              About me
              <textarea
                rows={7}
                // cols={40}
                className={styles.input}
                value={
                  user.id !== onEditId
                    ? descriptionInput
                    : onEditDescriptionInput
                }
                onChange={(event) =>
                  setOnEditDescriptionInput(event.currentTarget.value)
                }
                disabled={user.id !== onEditId}
              />
            </label>
          </div>
          <div className={styles.editBtnForm}>
            {user.id === onEditId ? (
              <button
                className={styles.btnSave}
                onClick={async () => {
                  setOnEditId(undefined);
                  await updateUserById(user.id);
                }}
              >
                save
              </button>
            ) : (
              <button
                className={styles.btnEdit}
                onClick={() => {
                  setOnEditId(user.id);
                }}
              >
                edit
              </button>
            )}
          </div>
        </form>
      </section>
    </main>
  );
}
