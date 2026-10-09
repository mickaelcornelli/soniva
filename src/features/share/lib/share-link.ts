export interface ShareTarget {
  title: string;
  url: string;
}

export type ShareOutcome = "shared" | "copied" | "cancelled" | "failed";

export interface ShareCapabilities {
  share?: (data: ShareTarget) => Promise<void>;
  canShare?: (data: ShareTarget) => boolean;
  clipboard?: { writeText: (text: string) => Promise<void> };
}

/** Dismissing the share sheet is not an error. */
export async function shareLink(
  data: ShareTarget,
  capabilities: ShareCapabilities = navigator,
): Promise<ShareOutcome> {
  // Called as methods: detached from `navigator` these functions throw "Illegal invocation".
  if (capabilities.share && (capabilities.canShare?.(data) ?? true)) {
    try {
      await capabilities.share(data);
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return "cancelled";
      // Share refused by the browser (permissions, context): fall back to copying.
    }
  }

  if (capabilities.clipboard) {
    try {
      await capabilities.clipboard.writeText(data.url);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}
