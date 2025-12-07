import * as React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "tertiary" | "link";
  size?: "sm" | "md" | "lg" | "icon";
  asChild?: boolean;
  href?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", asChild = false, href, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-burgundy text-white hover:bg-burgundy/90 border border-burgundy",
      secondary: "bg-transparent border border-deep-umber text-deep-umber hover:bg-warm-sand/20", // Adjusted based on heritage design
      tertiary: "bg-transparent underline-offset-4 hover:underline text-deep-umber",
      link: "text-deep-umber underline-offset-4 hover:underline",
    };

    const sizes = {
      sm: "h-9 px-3",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      icon: "h-10 w-10",
    };

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
      return (
        <Link
          href={href}
          className={combinedClassName}
          {...(props as any)}
        >
          {props.children}
        </Link>
      );
    }

    return (
      <button
        className={combinedClassName}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, cn };
