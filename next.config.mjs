/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: "out",
  basePath: "",

  output: "standalone",
  //trailingSlash: true,

  images: {
    loader: "custom",
    loaderFile: "./ImageLoader.js",
  },
};

export default nextConfig;
