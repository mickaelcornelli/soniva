import { siteConfig } from "@/config/site";

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}
