import styles from './avatar.module.css';

type Props = {
  className?: string;
  src: string;
  alt?: string;
}

export const Avatar = ({ className, src, alt }: Props) => {
  return (
    <img className={styles.avatar + ` ${className}`} src={src} alt={alt}>
    </img>
  );
};
