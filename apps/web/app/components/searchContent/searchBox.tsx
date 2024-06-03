import React, { useEffect, useState } from "react";
import Image from 'next/image';
import SearchIconSvg from "../../imgs/search.svg";
import ClearIconSvg from "../../imgs/error.svg";
import styles from "./searchBox.module.css";

const waitSec = 1;

type handleSearch = (query: string) => Promise<void>;

type SearchBoxProps = {
  handleSearch: handleSearch;
  error: string;
  isDisabled: boolean;
};

function useAutoSearch(search: (query: string) => Promise<void>, searchWaitSec: number) {
  const [query, setQuery] = useState("");
  const [isWait, setIsWait] = useState(false);

  useEffect(() => {
    if (!query) {
      setIsWait(false);
      return;
    }
    const w = setTimeout(async () => {
      await search(query);
      setIsWait(false);
    }, searchWaitSec * 1000);

    return () => {
      clearTimeout(w);
    };
  }, [query, search, searchWaitSec]);

  function onEnter() {
    setIsWait(false);
    search(query);
  }

  function type(q: string) {
    setIsWait(true);
    setQuery(q);
  }

  function clear() {
    setIsWait(false);
    setQuery('');
  }

  return [{ query, isWait }, onEnter, type, clear] as const;
}

function TipText({ error }: { error: string }) {
  let text = error;
  if (!error) {
    text = `Type and wait ${waitSec} second or press enter to search.`;
  }
  return <p className={styles.tip + ` ${error ? styles.error : ''}`}>{text}</p>;
}

function SearchBox({ handleSearch, error, isDisabled }: SearchBoxProps) {
  const [state, onEnter, type, clear] = useAutoSearch(handleSearch, waitSec);
  const { query, isWait } = state;
  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      onEnter();
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = e => {
    const v = e.target.value;
    type(v);
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.box + ` ${isDisabled ? styles.error : ''} ${isWait ? styles.isWaiting : ''}`} >
        <div className={styles.searchIcon}>
          <Image src={SearchIconSvg} alt="search icon" />
        </div>
        <input
          className={styles.input + ` ${isDisabled ? styles.disabled : ""}`}
          value={query}
          disabled={isDisabled}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={"type something like: tetris"}
        />
        <div className={styles.clearIcon}>
          <Image src={ClearIconSvg} alt="clear icon" onClick={clear} />
        </div>
      </div >
      <TipText error={error} />
    </div >
  );
}

export default SearchBox;
