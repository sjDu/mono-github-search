import { SearchRepoResponse } from './types';

const tokenMap = new Map<string, Map<string, boolean>>();

function getRepoStarMap(token: string) {
  let map = tokenMap.get(token);
  if (!map) {
    map = new Map<string, boolean>();
    tokenMap.set(token, map);
  }
  return map;
}

function appendStar(repo: SearchRepoResponse['items'][0], token: string) {
  const userStarMap = getRepoStarMap(token);
  return {
    ...repo,
    star: userStarMap.has(repo.full_name),
  };
}

export {
  getRepoStarMap,
  appendStar,
}