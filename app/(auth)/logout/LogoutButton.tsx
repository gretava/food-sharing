'use client';

import { useRouter } from 'next/navigation';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { logout } from './actions';
import styles from './logoutButton.module.scss';

export function LogoutButton() {
  const router = useRouter();
  return (
    <form>
      <button
        className={styles.logoutBtn}
        formAction={async () => {
          await logout();
          router.push('/' as any);
          router.refresh();
        }}
      >
        <RiLogoutCircleRLine size="1.8rem" />
      </button>
    </form>
  );
}
