import styles from './loader.module.css';


export function Loader({ className }: { className?: string }) {
  return (
    <div className={styles.loader + ` ${className}`}>
    </div>
  );
}

