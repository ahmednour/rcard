export default function ImageLoader({ src, width }) {
  return `${src}${width ? `?w=${width}` : ""}`;
}
