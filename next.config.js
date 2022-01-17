/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix:
    process.env.NODE_ENV === "development" ? "/" : "/word-guesser/out/",
};

module.exports = nextConfig;
