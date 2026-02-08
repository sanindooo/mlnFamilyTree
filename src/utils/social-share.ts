import { siteConfig } from "@/lib/seo";

export type SocialPlatform = "facebook" | "twitter" | "linkedin" | "instagram";

/**
 * Get the full URL for the current page
 */
export function getPageUrl(pathname: string): string {
	// In production, use the site URL from config
	// In development, use the current origin
	const baseUrl =
		typeof window !== "undefined"
			? window.location.origin
			: siteConfig.url;
	return `${baseUrl}${pathname}`;
}

/**
 * Generate platform-specific share URLs
 */
export function getShareUrl(
	platform: SocialPlatform,
	pageUrl: string,
	message?: string
): string {
	const encodedUrl = encodeURIComponent(pageUrl);
	const encodedMessage = message ? encodeURIComponent(message) : "";

	switch (platform) {
		case "facebook":
			return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
		case "twitter":
			return `https://twitter.com/intent/tweet?url=${encodedUrl}${
				encodedMessage ? `&text=${encodedMessage}` : ""
			}`;
		case "linkedin":
			return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
		case "instagram":
			// Instagram doesn't support URL sharing, so we'll copy to clipboard
			return pageUrl;
		default:
			return pageUrl;
	}
}

/**
 * Copy text to clipboard with error handling
 */
export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard && navigator.clipboard.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		} else {
			// Fallback for older browsers
			const textArea = document.createElement("textarea");
			textArea.value = text;
			textArea.style.position = "fixed";
			textArea.style.left = "-999999px";
			textArea.style.top = "-999999px";
			document.body.appendChild(textArea);
			textArea.focus();
			textArea.select();
			try {
				document.execCommand("copy");
				document.body.removeChild(textArea);
				return true;
			} catch (err) {
				document.body.removeChild(textArea);
				return false;
			}
		}
	} catch (err) {
		console.error("Failed to copy to clipboard:", err);
		return false;
	}
}
