import { atom } from 'jotai'

export const loginAtom = atom<{
  token: string
  user?: {
    name: string
    email: string
  }
  status: 'success' | 'unauthorized'

}>({
  token: '',
  user: undefined,
  status: 'unauthorized',
})