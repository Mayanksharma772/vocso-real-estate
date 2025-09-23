/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: [
    'puppeteer-extra',
    'puppeteer-extra-plugin-stealth',
    'puppeteer'
  ],
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't bundle puppeteer and related packages on the client side
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
      };

      config.externals = config.externals || [];
      config.externals.push({
        puppeteer: 'puppeteer',
        'puppeteer-extra': 'puppeteer-extra',
        'puppeteer-extra-plugin-stealth': 'puppeteer-extra-plugin-stealth'
      });
    }

    return config;
  }
};

module.exports = nextConfig;