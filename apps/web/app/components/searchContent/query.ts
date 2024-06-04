import { useCallback } from 'react';
import { useAtomValue } from 'jotai'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { starRepo } from "@repo/github-service";
import { loginAtom } from "../../atoms/atoms";

function useStarRepo(onSuccess: (data: { star: boolean }) => void) {
  const login = useAtomValue(loginAtom)
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async ({ repoFullName, star }: { repoFullName: string, star: boolean }) => {
      return starRepo(login.token, repoFullName, star);
    },
    onSuccess: (data) => {
      onSuccess(data);
      queryClient.invalidateQueries({ queryKey: ['repos'] })
    },
  })
  const handleStar = useCallback((repoFullName: string, star: boolean) => {
    mutation.mutate({ repoFullName, star })
  }, [mutation])

  const isPending = mutation.isPending;
  const isError = mutation.isError;

  return [isPending, isError, handleStar] as const;
}

export {
  useStarRepo,
}