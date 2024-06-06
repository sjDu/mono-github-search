# Mono Github Search

This is monorepo for a simple Github search app which is deployed on github page.

github page: https://sjdu.github.io/mono-github-search/

It includes 3 main packages:
- `web`: a [Next.js](https://nextjs.org/) app
- `@repo/github-service`: a npm package that provides a simple API to search for Github repositories
- `@repo/ui`: a stub React component library used by `web` application

## Github Service API

The `@repo/github-service` package provides a simple API to search for Github repositories.  It is designed for use on the client side by the `web` application, with a minimalistic design.

In this demo app, users are allow to use random token. The login will be always successful. However, the respositories are fetched with real data wihtout using the token which has a rate limit. If the rate limit is reached, the app will show an error message. All the API, other than qeury the github respositories, are not interacted with the real github API.

### Interface
```
type ApiResponse<T, K = undefined> = {
  status: 'success';
  data: T;
} | {
  status: 'fail';
  error: K;
};
```

### Login
This is a simple login API that returns a user object with a token. The token is used to authenticate the user for other API calls.

```
type LoginData = {
  token: string;
  user: {
    name: string;
    email: string;
  };
};

type login = (token: string) => Promise<ApiResponse<LoginData>

```

### Search Repositories
This API is used to search for Github repositories. It takes a query string and returns a list of repositories that match the query. This API calls the real Github API to fetch the repositories without authentication.
```
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

type searchRepo = (token: string, query: string, page = 1) => Promise<ApiResponse<SearchRepoData, SearchRepoError>>
```

### Star a Repository
This API is used to star/unstar a Github repository. It takes a repository full name and a boolean value to star/unstar the repository. It stores the starred info for each user (by `token`) in a map (`Map<repoFullName, boolean>`) in runtime. It does not interact with the real Github API.

Note that: To simulate a failure of the star button, this function will throw an error every fifth time it is triggered.

```
type StarRepoData = {
  repoFullName: string;
  star: boolean;
};

type starRepo = (token: string, repoFullName: string, star: boolean) => Promise<ApiResponse<StarRepoData>>
```

## Github Search App
This is a simple Github search app built with Next.js. The app has the following features:
- Support on Mobile device (width 320px+ )
### Login Page
- Login with a random token (login will always be successful)
### Search Page
- Search Box to search for Github repositories
  - Auto detect search: type your query in search box and wait 1 second will trigger the request.
  - Waiting effect(dotted border) for Auto detect search
  - API Fail / Rate limit count down error message
- List Responsitories
  - Infinite scroll to load more repositories
  - Click avatar to go to the owner's Github page
  - Click repository name to go to the repository's Github page
  - Click the "commits" to go to the repository's commits page.
- Star/unstar a repository by clicking on the star button
  - The star will not preserved after the page is refreshed but it will be preserved in the runtime.
  - Display Star/unstar fail effect on button. 
    - The fail will be shown every fifth time the star button is clicked

## Monorepo structure

It's built by using [Turborepo](https://turbo.build/repo/docs/). It's a tool that helps you manage monorepos with ease.

The monorepo structure is as follows:
```
mono-github-search
├── apps
  ├── web
├── pacakges // all shared packages
  ├── @repo/ui
  ├── @repo/github-service
  ├── @repo/typescript-config
  ├── @repo/eslint-config
```

## Build

To build all apps and packages, run the following command:

```
npm run build
```

## Develop

To develop all apps and packages, run the following command:

```
npm run dev
```
And go to `http://localhost:3000` to see the app.

## Github Actions
This repo is integrated with GitHub Actions. It will deploy to github page every time you push code to `main` branch.

The workflow files are located in:
- `.github/workflows/setup-node/action.yml`
- `.github/workflows/publish.yml`

## Todo & Improvements
- Design the Commit page UI
  - The github already has a decent commits page with rich content, so we directly link to it. However, if it's required, we can add a custom commits page by query `https://github.com/{user}/{repo_name}/commits/deferred_commit_data/`.
- Add more tests
  - We can use `jest` to provide unit test for `@repo/github-service`
  - We can use `Vitest` to provide unit test for `web` nextjs app
- Add user avatar on the right top corner
  - So the user can know which account is logged in currently.
- Persist the starred repositories
  - Even if it's running on client side, we can still use `localStorage` to store the starred repositories so that the user can see the starred repositories after the page is refreshed.
