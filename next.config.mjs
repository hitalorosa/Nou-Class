/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // qualquer projeto Supabase — o host real vem do .env.local
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
      // thumbnails do YouTube (aparecem em cards que só têm youtube_id)
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
    ],
  },
};

export default nextConfig;
