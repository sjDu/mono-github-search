import styles from "./page.module.css";
import LoginForm from './components/loginForm/loginForm';

export default function Page(): JSX.Element {

  return (
      <LoginForm className={styles.loginForm} />
  );
}
