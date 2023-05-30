/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
      SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvYWZtdWJoYnRheG5kaG9kY2JvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODUyNTYxNjIsImV4cCI6MjAwMDgzMjE2Mn0.F4NwlJ8uNgwSBNnFu1PfEIVclkglcJmeBrqi99TRqGE',
  },
  async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
        },
      ];
    },
}

module.exports = nextConfig
