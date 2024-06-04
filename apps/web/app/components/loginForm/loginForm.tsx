"use client";
import { useState } from 'react';
import { Button } from "@repo/ui/button";
import { Input } from "@repo/ui/input";
import styles from "./loginForm.module.css";
import { useLogin } from './query';

export default function LoginForm({ className }: { className?: string }) {
  const [token, setToken] = useState('');
  const [handleLogin] = useLogin(token);

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