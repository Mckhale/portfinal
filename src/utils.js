export const getImageUrl = (path) => {
  if (!path) return "";
  const isAbsolute = /^https?:\/\//i.test(path) || path.startsWith("/");
  if (isAbsolute) return path;
  return new URL(`/assets/${path}`, import.meta.url).href;
};
