/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { 
    domains: ['i.ibb.co', 'quickchart.io', 'api.open-meteo.com'],
    unoptimized: true
  },
  output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  }
};

module.exports = nextConfig;