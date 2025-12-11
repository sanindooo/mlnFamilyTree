import * as React from "react";
import { cn } from "@/lib/utils";
import { BiChevronRight } from "react-icons/bi";
import Link from "next/link";

const Breadcrumb = React.forwardRef<
	HTMLElement,
	React.HTMLAttributes<HTMLElement>
>(({ className, ...props }, ref) => (
	<nav
		ref={ref}
		aria-label="breadcrumb"
		className={cn("flex flex-wrap items-center text-sm text-muted", className)}
		{...props}
	/>
));
Breadcrumb.displayName = "Breadcrumb";

const BreadcrumbList = React.forwardRef<
	HTMLOListElement,
	React.OlHTMLAttributes<HTMLOListElement>
>(({ className, ...props }, ref) => (
	<ol
		ref={ref}
		itemScope
		itemType="https://schema.org/BreadcrumbList"
		className={cn("flex flex-wrap items-center gap-2", className)}
		{...props}
	/>
));
BreadcrumbList.displayName = "BreadcrumbList";

interface BreadcrumbItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
	position?: number;
}

const BreadcrumbItem = React.forwardRef<HTMLLIElement, BreadcrumbItemProps>(
	({ className, position, ...props }, ref) => (
		<li
			ref={ref}
			itemScope
			itemProp="itemListElement"
			itemType="https://schema.org/ListItem"
			className={cn("inline-flex items-center gap-2", className)}
			{...props}
		>
			{props.children}
			{position && <meta itemProp="position" content={String(position)} />}
		</li>
	)
);
BreadcrumbItem.displayName = "BreadcrumbItem";

interface BreadcrumbLinkProps extends React.ComponentPropsWithoutRef<
	typeof Link
> {
	isCurrentPage?: boolean;
}

const BreadcrumbLink = React.forwardRef<HTMLAnchorElement, BreadcrumbLinkProps>(
	({ className, isCurrentPage, children, ...props }, ref) => (
		<Link
			ref={ref}
			itemProp="item"
			aria-current={isCurrentPage ? "page" : undefined}
			className={cn("transition-colors hover:text-deep-umber", className)}
			{...props}
		>
			<span itemProp="name">{children}</span>
		</Link>
	)
);
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbSeparator = ({
	children,
	className,
	...props
}: React.ComponentProps<"li">) => (
	<li
		role="presentation"
		aria-hidden="true"
		className={cn("[&>svg]:size-3.5", className)}
		{...props}
	>
		{children ?? <BiChevronRight />}
	</li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbSeparator,
};
