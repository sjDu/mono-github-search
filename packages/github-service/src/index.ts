export async function login(token: string) {
  return await Promise.resolve({
    token,
    user: {
      name: 'Tester Stark',
      email: 'tester.tony.stark@starkindustry.com'
    },
    status: 'success',
  } as const);
}

type SearchRepoResponse = {
  total_count: number;
  items: {
    id: number;
    owner: {
      avatar_url: string;
      html_url: string;
    };
    html_url: string;
    full_name: string;
    description: string;
    star?: boolean;
  }[];
  incomplete_results: boolean;
};

function appendStar(repo: SearchRepoResponse['items'][0], token: string) {
  const userStarMap = getRepoStarMap(token);
  return {
    ...repo,
    star: userStarMap.has(repo.full_name),
  };
}

// in practice, the `token` here should be pass in by server layer
export async function searchRepo(token: string, query: string, page = 1) {
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

const tokenMap = new Map<string, Map<string, boolean>>();

function getRepoStarMap(token: string) {
  let map = tokenMap.get(token);
  if (!map) {
    map = new Map<string, boolean>();
    tokenMap.set(token, map);
  }
  return map;
}


export async function starRepo(token: string, repoFullName: string, star: boolean) {

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