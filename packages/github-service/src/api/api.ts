import { SearchRepoResponse, ApiResponse } from './types';
import { appendStar, getRepoStarMap } from './star';

type LoginData = {
  token: string;
  user: {
    name: string;
    email: string;
  };
};
async function login(token: string): Promise<ApiResponse<LoginData>> {
  return await Promise.resolve({
    data: {
      token,
      user: {
        name: 'Tester Stark',
        email: 'tester.tony.stark@starkindustry.com'
      },
    },
    status: 'success',
  });
}

type SearchRepoData = {
  items: SearchRepoResponse['items'];
  resumeTime: string | null;
  total: number;
  page: number;
};

type SearchRepoError = {
  resumeTime: string | null;
  isRateLimit: boolean;
  error?: any;
};

// in practice, the `token` here should be pass in by server layer
async function searchRepo(token: string, query: string, page = 1): Promise<ApiResponse<SearchRepoData, SearchRepoError>> {
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
    return {
      status: 'fail',
      error: {
        resumeTime,
        isRateLimit,
      }
    }
  }
  try {
    const result: SearchRepoResponse = await r.json();
    return {
      status: 'success',
      data: {
        items: result.items.map(it => appendStar(it, token)),
        resumeTime,
        total: result.total_count,
        page
      }
    }
  } catch (error) {
    return {
      status: 'fail',
      error: {
        resumeTime,
        isRateLimit: false,
        error,
      }
    }
  }
}

type StarRepoData = {
  repoFullName: string;
  star: boolean;
};

let clickCount = 0;
async function starRepo(token: string, repoFullName: string, star: boolean): Promise<ApiResponse<StarRepoData>> {
  // pretent API process time
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // pretent API error every 5 times
  clickCount = clickCount % 5 + 1;
  if (clickCount % 5 === 0) {
    return {
      status: 'fail',
      error: undefined,
    }
  }

  const userStarMap = getRepoStarMap(token);
  if (star) {
    userStarMap.set(repoFullName, true);
  } else {
    userStarMap.delete(repoFullName);
  }
  return {
    status: 'success',
    data: {
      repoFullName,
      star,
    }
  }
}

export {
  login,
  searchRepo,
  starRepo,
}