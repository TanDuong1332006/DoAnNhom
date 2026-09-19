import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  basePath: '/DoAnNhom', // Bắt buộc phải có dòng này (trùng tên repository của bạn)
  images: {
    unoptimized: true, // Bắt buộc nếu bạn có dùng thẻ <Image> của Next.js
  },
};

export default nextConfig;
