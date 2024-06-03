"use client";
import { redirect } from 'next/navigation'
import { useAtomValue } from 'jotai'
import { loginAtom } from "../atoms/atoms";
import SearchContent from "../components/searchContent/searchContent";
import styles from './page.module.css'

const data = [
  {
    id: 76954504,
    owner: {
      avatar_url: "https://avatars2.githubusercontent.com/u/5383506?v=4",
      html_url: "https://github.com/chvin"
    },
    html_url: "https://github.com/chvin/react-tetris",
    full_name: "chvin/react-tetris",
    description: "Use React, Redux, Immutable to code Tetris. 🎮"
  },
  {
    id: 94079558,
    owner: {
      avatar_url: "https://avatars1.githubusercontent.com/u/12221718?v=4",
      html_url: "https://github.com/Binaryify"
    },
    html_url: "https://github.com/Binaryify/vue-tetris",
    full_name: "Binaryify/vue-tetris",
    description: "Use Vue, Vuex to code Tetris.使用 Vue, Vuex 做俄罗斯方块 "
  },
  {
    id: 19886948,
    owner: {
      avatar_url: "https://avatars0.githubusercontent.com/u/8196313?v=4",
      html_url: "https://github.com/Hextris"
    },
    html_url: "https://github.com/Hextris/hextris",
    full_name: "Hextris/hextris",
    description: "Fast paced HTML5 puzzle game inspired by Tetris!"
  },
  {
    id: 95875527,
    owner: {
      avatar_url: "https://avatars2.githubusercontent.com/u/10406525?v=4",
      html_url: "https://github.com/exyte"
    },
    html_url: "https://github.com/exyte/ARTetris",
    full_name: "exyte/ARTetris",
    description: "Augmented Reality Tetris made with ARKit and SceneKit"
  },
  {
    id: 20853547,
    owner: {
      avatar_url: "https://avatars0.githubusercontent.com/u/250750?v=4",
      html_url: "https://github.com/skidding"
    },
    html_url: "https://github.com/skidding/flatris",
    full_name: "skidding/flatris",
    description: "Fast-paced two-player web game"
  },
];

// duplicate mock data
while (data.length < 100) {
  data.push(...data.map((it) => ({ ...it, id: it.id + data.length })));
}

export default function SearchPage(): JSX.Element {
  const login = useAtomValue(loginAtom)
  if (login.status !== 'success') {
    redirect('/');
  }

  return (
    <div className={styles.container}>
      <SearchContent list={data} isLoading={false} handleSearch={async () => { }} error='' isRateLimit={false} />
    </div>
  );
}
