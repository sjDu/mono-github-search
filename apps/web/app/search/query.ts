import { useState, useCallback, useEffect, useMemo } from 'react';
import { useAtomValue } from 'jotai'
import { useInfiniteQuery } from '@tanstack/react-query'
import { searchRepo } from "@repo/github-service";
import { loginAtom } from "../atoms/atoms";

function useSearchList() {
  const login = useAtomValue(loginAtom)
  const [query, setQuery] = useState('');
  const [isRateLimit, setIsRateLimit] = useState(false);
  const { data, isFetching, error, isError, fetchNextPage } = useInfiniteQuery({
    queryKey: ['repos', query],
    queryFn: async ({ pageParam }) => {
      const response = await searchRepo(login.token, query, pageParam)
      if (response.status === 'fail') {
        throw { ...response.error };
      }
      return response.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.page + 1,
    enabled: !!query,
  });

  const errorObj = error as unknown as {
    resumeTime: string;
    isRateLimit: boolean;
  };

  // wait for API rate limit
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
      total: data?.pages?.[0]?.total || 0,
      isFetching,
      isError,
      resumeTime: Number(errorObj?.resumeTime) || 0,
      isRateLimit,
    },
    search,
    nextPage,
  ] as const;
}

export {
  useSearchList,
}