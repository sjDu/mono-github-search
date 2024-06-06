import { atom } from 'jotai'

export const loginAtom = atom<{
  token: string
  user?: {
    name: string
    email: string
  }
  status: 'success' | 'unauthorized' | 'fail'

}>({
  token: '',
  user: undefined,
  status: 'unauthorized',
})