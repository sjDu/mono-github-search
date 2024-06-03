"use client";
import { redirect } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { loginAtom } from "../atoms/atoms";

export default function SearchPage(): JSX.Element {
  const login = useAtomValue(loginAtom)
  if (login.status !== 'success') {
    redirect('/');
  }

  return (
    <div>
      Search
    </div>
  );
}
