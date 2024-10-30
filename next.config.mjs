/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: "",
  trailingSlash: true,

  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
