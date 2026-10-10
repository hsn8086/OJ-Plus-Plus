import { qoj } from './qoj.ts';
import { luogu } from './luogu.ts';
import { atcoder } from './atcoder.ts';
import { codeforces } from './codeforces.ts';
import { nowcoder } from './nowcoder.ts';
import type { SiteAdapter } from './types.ts';

export const sites: readonly SiteAdapter[] = [nowcoder, codeforces, atcoder, qoj, luogu];
export const siteMatches = sites.flatMap((site) => site.hosts.map((host) => `https://${host}/*`));

export function resolveSite(url: URL): SiteAdapter | undefined {
  if (url.protocol !== 'https:') return undefined;
  return sites.find((site) => site.hosts.includes(url.hostname));
}
