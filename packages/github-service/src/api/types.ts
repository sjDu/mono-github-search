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

type ApiResponse<T, K = undefined> = {
  status: 'success';
  data: T;
} | {
  status: 'fail';
  error: K;
}

export type {
  SearchRepoResponse,
  ApiResponse,
}