/** @type {import('next').NextConfig} */
const nextConfig = {
 basePath: "",
  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
