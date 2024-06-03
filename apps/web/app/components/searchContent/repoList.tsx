
import styles from './repoList.module.css';
import { Avatar } from '@repo/ui/avatar';
import { Loader } from '@repo/ui/loader';
import { StarButton } from '@repo/ui/starButton';

type RepoItem = {
  id: number;
  full_name: string;
  html_url: string;
  description: string;
  owner: {
    avatar_url: string;
    html_url: string;
  };

};

type RepoListProps = {
  list: RepoItem[];
  isLoading: boolean;
};

function Repo(it: RepoItem) {
  return (
    <div className={styles.itemBlock}>
      <a className={styles.avatarBox} href={it.owner.html_url} target="_blank">
        <Avatar src={it.owner.avatar_url} alt="" />
      </a>
      <div className={styles.itemContent}>
        <div className={styles.row}>
          <a className={styles.name} href={it.html_url} target="_blank">
            {it.full_name}
          </a>
          <a className={styles.commits} href={it.html_url + '/commits'} target="_blank">
            Commits
          </a>
          <StarButton />
        </div>
        <div className={styles.desc}>{it.description}</div>
      </div>
    </div >
  );
}

export default function RepoList({ list, isLoading }: RepoListProps) {
  return (
    <ul className={styles.listUl}>
      {list.map((it) => {
        return (
          <li key={it.id}>
            <Repo {...it} />
          </li>
        );
      })}
      {isLoading ? (
        <div className={styles.loaderBox}>
          <Loader />
        </div>
      ) : null}
    </ul >
  );
}

