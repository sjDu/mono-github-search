"use client";
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSetAtom } from 'jotai'
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import { login } from "@repo/github-service";
import styles from "./loginForm.module.css";
import { loginAtom } from "../../atoms/atoms";

export default function LoginForm({ className }: { className?: string }) {
  const setLogin = useSetAtom(loginAtom)
  const router = useRouter()
  const [token, setToken] = useState('');
  const handleLogin = useCallback(async () => {
    const response = await login(token);
    setLogin(() => response);
    router.push('/search')
  }, [token]);

  return (<div className={styles.loginForm + ` ${className}`}>
    <Input className={styles.tokenInput}
      placeholder="Enter your token"
      value={token}
      onChange={(v) => setToken(v)}
      onEnter={handleLogin}
    />
    <Button className={styles.button} onClick={handleLogin}>
      Login
    </Button>
  </div>)
} 