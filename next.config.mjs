/** @type {import('next').NextConfig} */
const nextConfig = {
  
  //trailingSlash: true,

  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
