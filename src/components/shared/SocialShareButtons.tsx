"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
	BiLinkAlt,
	BiLogoLinkedinSquare,
	BiLogoFacebookCircle,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { toast } from "sonner";
import {
	getPageUrl,
	getShareUrl,
	copyToClipboard,
	SocialPlatform,
} from "@/utils/social-share";

interface SocialShareButtonsProps {
	message?: string;
	className?: string;
	buttonClassName?: string;
	variant?: "default" | "compact";
}

export function SocialShareButtons({
	message = "Check out this page from MLN Museum",
	className = "",
	buttonClassName = "",
	variant = "default",
}: SocialShareButtonsProps) {
	const pathname = usePathname();
	const pageUrl = getPageUrl(pathname);

	const handleShare = (platform: SocialPlatform) => {
		const shareUrl = getShareUrl(platform, pageUrl, message);
		window.open(shareUrl, "_blank", "noopener,noreferrer");
	};

	const handleCopyLink = async () => {
		const success = await copyToClipboard(pageUrl);
		if (success) {
			toast.success("Link copied to clipboard!");
		} else {
			toast.error("Failed to copy link");
		}
	};

	const baseButtonClass =
		variant === "compact"
			? "size-8 rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors"
			: "rounded-[1.25rem] bg-warm-sand/30 p-1 hover:bg-warm-sand/50 transition-colors";

	return (
		<ul
			className={`flex items-center ${variant === "compact" ? "justify-center" : "justify-start"} flex-wrap gap-2 list-none m-0 p-0 ${className}`}
		>
			<li>
				<button
					onClick={handleCopyLink}
					className={`${baseButtonClass} ${buttonClassName} hover:cursor-pointer`}
					aria-label="Copy link"
				>
					<BiLinkAlt className="size-6 text-deep-umber" />
				</button>
			</li>
			<li>
				<button
					onClick={() => handleShare("linkedin")}
					className={`${baseButtonClass} ${buttonClassName} hover:cursor-pointer`}
					aria-label="Share on LinkedIn"
				>
					<BiLogoLinkedinSquare className="size-6 text-deep-umber" />
				</button>
			</li>
			<li>
				<button
					onClick={() => handleShare("twitter")}
					className={`${baseButtonClass} ${buttonClassName} hover:cursor-pointer`}
					aria-label="Share on X"
				>
					<FaXTwitter className="size-6 p-0.5 text-deep-umber" />
				</button>
			</li>
			<li>
				<button
					onClick={() => handleShare("facebook")}
					className={`${baseButtonClass} ${buttonClassName} hover:cursor-pointer`}
					aria-label="Share on Facebook"
				>
					<BiLogoFacebookCircle className="size-6 text-deep-umber" />
				</button>
			</li>
			</ul>
	);
}
