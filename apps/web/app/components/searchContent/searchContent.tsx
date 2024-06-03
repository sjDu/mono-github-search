import styles from './searchContent.module.css';
import RepoList from './repoList';
import SearchBox from './searchBox';

interface Props {
  list: any[];
  isLoading: boolean;
  handleSearch: (v: string) => Promise<void>;
  error: string;
  isRateLimit: boolean;

}

export default function Content({ list, isLoading, handleSearch, error, isRateLimit }: Props) {
  return (
    <main className={styles.content}>
      <div className={styles.contentBlock}>
        <div className={styles.searchBlock}>
          <SearchBox
            handleSearch={handleSearch}
            error={error}
            isDisabled={isRateLimit}
          />
        </div>
        <RepoList list={list} isLoading={isLoading} />
      </div>
    </main>
  );
}