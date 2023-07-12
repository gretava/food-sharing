// import styles from './globals.scss';
import Link from 'next/link';
import styles from './page.module.scss';

export default function Home() {
  return (
    <main className={styles.backroundArea}>
      <section className={styles.textArea}>
        <h1 className={styles.h1}>waste not</h1>
        <p className={styles.p}>
          Space for like-minded individuals to contribute towards less food
          waste and better tomorrow
        </p>
        <div className={styles.links}>
          <Link className={styles.loginSignup} href="/login">
            Log in
          </Link>
          <Link className={styles.loginSignup} type="button" href="/signup">
            Sign up
          </Link>
        </div>
      </section>
    </main>
  );
}
