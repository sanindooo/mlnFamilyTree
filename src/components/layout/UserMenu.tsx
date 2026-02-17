"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export function UserMenu() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [open]);

  if (!isLoaded || !isSignedIn) return null;

  const initials = user.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deep-umber focus-visible:ring-offset-2 cursor-pointer"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {user.imageUrl ? (
          <Image
            src={user.imageUrl}
            alt={user.fullName || "User avatar"}
            width={32}
            height={32}
            className="rounded-full border-2 border-antique-gold object-cover"
          />
        ) : (
          <div className="flex size-8 items-center justify-center rounded-full border-2 border-antique-gold bg-warm-sand/30 text-xs font-medium text-deep-umber">
            {initials}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 rounded-lg border border-warm-sand bg-white py-1 shadow-lg z-50">
          <div className="border-b border-warm-sand px-4 py-3">
            <p className="text-sm font-medium text-deep-umber truncate">
              {user.fullName}
            </p>
            <p className="text-xs text-muted truncate">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          <div className="py-1">
            <Link
              href="/members/dashboard"
              className="block px-4 py-2 text-sm text-deep-umber hover:bg-warm-sand/20 transition-colors"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              href="/members"
              className="block px-4 py-2 text-sm text-deep-umber hover:bg-warm-sand/20 transition-colors"
              onClick={() => setOpen(false)}
            >
              Members Directory
            </Link>
          </div>

          <div className="border-t border-warm-sand py-1">
            <button
              onClick={() => signOut({ redirectUrl: "/" })}
              className="block w-full px-4 py-2 text-left text-sm text-deep-umber hover:bg-warm-sand/20 transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
