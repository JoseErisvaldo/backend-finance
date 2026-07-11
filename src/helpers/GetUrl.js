export const getURL = (path = "") => {
  let url =
    process.env.SITE_URL && process.env.SITE_URL.trim() !== ""
      ? process.env.SITE_URL
      : "http://localhost:5173";

  url = url.replace(/\/+$/, "");
  path = path.replace(/^\/+/, "");

  return path ? `${url}/${path}` : url;
};
