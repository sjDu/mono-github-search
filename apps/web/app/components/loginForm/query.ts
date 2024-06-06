import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai'
import { login } from "@repo/github-service";
import { loginAtom } from "../../atoms/atoms";

function useLogin(token: string) {
  const setLogin = useSetAtom(loginAtom)
  const router = useRouter()
  const handleLogin = useCallback(async () => {
    const response = await login(token);
    if (response.status === 'success') {
      setLogin(() => {
        return ({
          token: response.data.token,
          user: response.data.user,
          status: response.status,
        })
      });
      router.push('/search')
    }
  }, [token]);

  return [handleLogin] as const;
}

export {
  useLogin,
}