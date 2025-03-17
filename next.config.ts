import path from "path";
import { NextConfig } from "next";

const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  sassOptions: {
    logger: {
      debug: () => {},
      warn: () => {},
      error: console.error,
    },
  },
  reactStrictMode: false,
  pageExtensions: ["tsx", "ts"],
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            // Content Security Policy (CSP) - Güvenlik Politikası
            key: "Content-Security-Policy",
            value: isProduction
              ? "connect-src 'self' blob:; default-src 'self' fonts.googleapis.com fonts.gstatic.com; img-src data: 'self' https: blob:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com;"
              : "connect-src 'self' blob:; default-src 'self' fonts.googleapis.com fonts.gstatic.com; img-src * data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' fonts.googleapis.com fonts.gstatic.com;", // Localhost için daha gevşek
          },
          {
            // X-Frame-Options - Çerçeveleme saldırılarına karşı koruma
            key: "X-Frame-Options",
            value: isProduction ? "DENY" : "", // Üretimde 'DENY', localhost'ta boş
          },
          {
            // X-Content-Type-Options - Yanlış MIME türlerini engeller
            key: "X-Content-Type-Options",
            value: "nosniff", // Her iki ortam için de geçerli
          },
          {
            // Referrer-Policy - Yönlendirme bilgisi kontrolü
            key: "Referrer-Policy",
            value: isProduction
              ? "strict-origin-when-cross-origin"
              : "no-referrer-when-downgrade", // Localhost için daha gevşek
          },
          {
            // Permissions-Policy - Tarayıcı izin politikası
            key: "Permissions-Policy",
            value: "geolocation=(self), microphone=(), camera=()", // Her iki ortam için de geçerli
          },
          {
            // Strict-Transport-Security (HSTS) - HTTPS Zorlaması
            key: "Strict-Transport-Security",
            value: isProduction
              ? "max-age=63072000; includeSubDomains; preload"
              : "", // Localhost'ta devre dışı
          },
        ],
      },
    ];
  },
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: ["**/server/uploads/**", "**/database/**"],
      };
    }

    config.resolve.alias["@"] = path.join(__dirname, "src");
    return config;
  },
};

export default nextConfig;
