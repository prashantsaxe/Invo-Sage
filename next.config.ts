/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/dashboard",
        permanent: true, // Set to false if it's temporary
      },
    ];
  },
};

module.exports = nextConfig;
