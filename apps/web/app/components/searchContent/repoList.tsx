
import { useState, useCallback } from 'react';
import styles from './repoList.module.css';
import { Avatar } from '@repo/ui/avatar';
import { Loader } from '@repo/ui/loader';
import { StarButton } from '@repo/ui/starButton';
import { useStarRepo } from './query';

type RepoItem = {
  id: number;
  full_name: string;
  html_url: string;
  description: string;
  owner: {
    avatar_url: string;
    html_url: string;
  };
  star?: boolean;
};

type RepoListProps = {
  list: RepoItem[];
  isLoading: boolean;
};

function Repo(props: RepoItem) {
  const [isStarred, setIsStarred] = useState(props.star || false);

  const [isPending, isError, handleStar] = useStarRepo((data) => {
    setIsStarred(data.star);
  })

  const handleClick = useCallback(() => {
    handleStar(props.full_name, !isStarred);
  }, [handleStar, isStarred]);


  return (
    <div className={styles.itemBlock}>
      <a className={styles.avatarBox} href={props.owner.html_url} target="_blank">
        <Avatar src={props.owner.avatar_url} alt="" />
      </a>
      <div className={styles.itemContent}>
        <div className={styles.row}>
          <a className={styles.name} href={props.html_url} target="_blank">
            {props.full_name}
          </a>
          <a className={styles.commits} href={props.html_url + '/commits'} target="_blank">
            Commits
          </a>
          <StarButton isStarred={isStarred} onClick={handleClick} isLoading={isPending} isError={isError} />
        </div>
        <div className={styles.desc}>{props.description}</div>
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

