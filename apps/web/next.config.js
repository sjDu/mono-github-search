/** @type {import('next').NextConfig} */
module.exports = {
  transpilePackages: ["@repo/ui"],
  basePath: "/mono-github-search",
  output: "export",  // <=== enables static exports
  reactStrictMode: true,
};
