// import styles from './globals.scss';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.backroundArea}>
      <section className={styles.textArea}>
        <h1 className={styles.h1}>waste not</h1>
        <p className={styles.p}>
          Connecting like-minded individuals through food sharing to reduce food
          waste
        </p>
        <div className={styles.links}>
          <Link className={styles.signupBtn} type="button" href="/signup">
            Sign up
          </Link>
          <Link className={styles.loginBtn} href="/login">
            Log in
          </Link>
        </div>
      </section>
    </main>
  );
}
