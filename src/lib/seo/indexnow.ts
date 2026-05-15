/**
 * IndexNow — instant indexing protocol used by Bing, Yandex, Seznam,
 * Naver and a growing list of search engines. Submit a URL once and
 * every participating engine learns about it within minutes.
 *
 * Key ownership is proven by hosting the same key at
 *   https://vocazai.com/{KEY}.txt
 * which already exists under `public/`. Don't change the key without
 * updating that file too.
 */

export const INDEXNOW_KEY = "c33f90e268df7ba8f138ee23aa4b571b";
export const INDEXNOW_HOST = "vocazai.com";

const SITE = process.env.NEXT_PUBLIC_APP_URL ?? `https://${INDEXNOW_HOST}`;

function abs(url: string): string {
  if (url.startsWith("http")) return url;
  return `${SITE}${url.startsWith("/") ? "" : "/"}${url}`;
}

/**
 * Submit one or more URLs to the IndexNow network. Returns the HTTP
 * status from Bing's endpoint (the canonical IndexNow gateway, which
 * forwards to the other participating engines).
 */
export async function pingIndexNow(urls: string | string[]): Promise<number> {
  const list = (Array.isArray(urls) ? urls : [urls]).map(abs);
  const res = await fetch("https://api.indexnow.org/IndexNow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: INDEXNOW_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `${SITE}/${INDEXNOW_KEY}.txt`,
      urlList: list,
    }),
  });
  return res.status;
}
