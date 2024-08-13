const withPWA = require('next-pwa')({
    dest: 'public'
  });
  
  module.exports = withPWA({
    // Next.js 설정
  });


const { GenerateSW } = require('workbox-webpack-plugin');

module.exports = {
  webpack: (config, { isServer, dev }) => {
    if (!dev && !isServer) {
      config.plugins.push(
        new GenerateSW({
          // Workbox 설정 옵션
        })
      );
    }
    return config;
  },
};