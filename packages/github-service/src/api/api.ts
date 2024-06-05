import { SearchRepoResponse } from './types';
import { appendStar, getRepoStarMap } from './star';

async function login(token: string) {
  return await Promise.resolve({
    token,
    user: {
      name: 'Tester Stark',
      email: 'tester.tony.stark@starkindustry.com'
    },
    status: 'success',
  } as const);
}

// in practice, the `token` here should be pass in by server layer
async function searchRepo(token: string, query: string, page = 1) {
  let url = "https://api.github.com/search/repositories?sort=stars&order=desc";

  if (query && query.length) {
    url += `&q=${query}`;
  }

  if (page) {
    url += `&page=${page}`;
  }

  let r = await fetch(url);
  const resumeTime = r.headers.get("X-RateLimit-Reset");
  const remaining = r.headers.get("X-RateLimit-Remaining");
  if (!r.ok) {
    const isRateLimit = remaining === "0";
    throw { resumeTime, isRateLimit };
  }
  try {
    const result: SearchRepoResponse = await r.json();
    return {
      items: result.items.map(it => appendStar(it, token)),
      resumeTime,
      total: result.total_count,
      page
    };
  } catch (error) {
    throw { resumeTime, error, isRateLimit: false };
  }
}

let clickCount = 0;
async function starRepo(token: string, repoFullName: string, star: boolean) {
  // pretent API process time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // pretent API error every 5 times
  clickCount = clickCount % 5 + 1;
  if (clickCount % 5 === 0) {
    throw new Error('Random Mock Error');
  }

  const userStarMap = getRepoStarMap(token);
  if (star) {
    userStarMap.set(repoFullName, true);
  } else {
    userStarMap.delete(repoFullName);
  }
  return {
    status: 'success',
    repoFullName,
    star,
  }
}

export {
  login,
  searchRepo,
  starRepo,
}