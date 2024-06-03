"use client";
import styles from "./page.module.css";
import { Button } from "@repo/ui/button";
import { login } from "@repo/github-service";

export default function Page(): JSX.Element {
  return (
    <main className={styles.main}>
      <Button className={styles.button} onClick={async () => {
        const response = await login('token');
        console.log('login result', response);
      }}>
        Login
      </Button>
    </main>
  );
}
