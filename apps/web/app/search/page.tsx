"use client";
import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { redirect } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchRepo } from "@repo/github-service";
import { loginAtom } from "../atoms/atoms";
import SearchContent from "../components/searchContent/searchContent";
import styles from './page.module.css'

function useInfiniteScroll(isFetching: boolean, nextPage: () => void, isHide: boolean) {
  const observerRef = useRef<IntersectionObserver>();
  const footerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (isFetching) return;

    observerRef.current = new IntersectionObserver(async function (entries) {
      if ((entries?.[0]?.intersectionRatio ?? 0) <= 0) {
        return;
      }
      nextPage();
    });

    observerRef.current.observe(footerRef.current as Element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [nextPage, isFetching]);

  const footer = <footer ref={footerRef} className={styles.footer + ` ${isHide ? styles.hide : ''}`} />
  return [
    footer,
  ] as const;
}

function useSearchList() {
  const login = useAtomValue(loginAtom)
  const [query, setQuery] = useState('');
  const [isRateLimit, setIsRateLimit] = useState(false);
  const { data, isFetching, error, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: ['repos', query],
    queryFn: async ({ pageParam }) => {
      return searchRepo(login.token, query, pageParam)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
    enabled: !!query,
  });

  const errorObj = error as unknown as {
    resumeTime: string;
    isRateLimit: boolean;
  };


  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isError) {
      if (isError && errorObj?.isRateLimit) {
        setIsRateLimit(errorObj?.isRateLimit);
        timeout = setTimeout(() => {
          setIsRateLimit(false);
        }, (Number(errorObj?.resumeTime) - Date.now() / 1000) * 1000);
      }
    }

    return () => clearTimeout(timeout);
  }, [isError, error]);

  const items = useMemo(() => {
    if (!data) return [];

    return data.pages.flatMap((it) => it.items);
  }, [data]);

  const search = useCallback(async (q: string) => {
    setQuery(q);
  }, []);

  const nextPage = useCallback(() => {
    if (isFetching) return;

    fetchNextPage();
  }, [isFetching, fetchNextPage]);

  return [
    {
      items,
      isFetching,
      isError,
      resumeTime: Number(errorObj?.resumeTime) || 0,
      isRateLimit,
    },
    search,
    nextPage,
  ] as const;
}

function useCountdownError(resumeTime: number, isRateLimit: boolean, isError: boolean) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let id: NodeJS.Timeout;
    if (isRateLimit) {
      const left = Math.floor(resumeTime - Date.now() / 1000);
      setCount(left);
      id = setInterval(() => {
        setCount(c => c - 1);
      }, 1000);
    }

    return () => clearInterval(id);
  }, [isRateLimit, setCount, resumeTime]);

  let error = "";
  if (isError) {
    if (isRateLimit) {
      error = "Wait " + count + " seconds for next request.";
    } else {
      error = "Fetch fail.";
    }
  }

  return [error] as const;
}

export default function SearchPage(): JSX.Element {
  const login = useAtomValue(loginAtom)
  if (login.status !== 'success') {
    redirect('/');
  }

  const [state, search, nextPage] = useSearchList();
  const { items: list, isFetching, isError, resumeTime, isRateLimit } = state;

  const [error] = useCountdownError(resumeTime, isRateLimit, isError);

  const isHide = list.length === 0;
  const [footer] = useInfiniteScroll(isFetching, nextPage, isHide);

  return (
    <div className={styles.container}>
      <SearchContent list={list} isLoading={isFetching} handleSearch={search} error={error} isRateLimit={isRateLimit} />
      {footer}
    </div>
  );
}
