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
  }[];
  incomplete_results: boolean;
};

export async function searchRepo(query: string, page = 1) {
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
      items: result.items,
      resumeTime,
      total: result.total_count,
      page
    };
  } catch (error) {
    throw { resumeTime, error, isRateLimit: false };
  }
}