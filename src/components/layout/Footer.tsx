import React from "react";
import Link from "next/link";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";
import { FooterNewsletter } from "./FooterNewsletter";

export function Footer() {
  return (
    <footer id="relume" className="py-12 md:py-18 lg:py-20 bg-cream border-t border-warm-sand">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-20">
          <div className="flex flex-col">
            <Link href="/" className="mb-5 md:mb-6">
               <span className="font-serif font-bold text-2xl text-deep-umber">MLN Museum</span>
            </Link>
            <p className="mb-5 md:mb-6 text-deep-umber">Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.</p>
            <FooterNewsletter />
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-3 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4 text-deep-umber">Explore</h2>
              <ul>
                <li className="py-2 text-sm">
                  <Link href="/mln-story" className="flex items-center gap-3 hover:text-burgundy">
                    <span>MLN Biography</span>
                  </Link>
                </li>
                <li className="py-2 text-sm">
                  <Link href="/tree" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Family tree</span>
                  </Link>
                </li>
                <li className="py-2 text-sm">
                  <Link href="/gallery" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Gallery</span>
                  </Link>
                </li>
                <li className="py-2 text-sm">
                  <Link href="/search" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Search</span>
                  </Link>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4 text-deep-umber">Connect</h2>
              <ul>
                <li className="py-2 text-sm">
                  <a href="mailto:contact@nsibirwa.org" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Contact</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Contribute</span>
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4 text-deep-umber">Follow</h2>
              <ul className="flex flex-col items-start">
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3 hover:text-burgundy">
                    <BiLogoFacebookCircle className="size-6" />
                    <span>Facebook</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="#" className="flex items-center gap-3 hover:text-burgundy">
                    <FaXTwitter className="size-6 p-0.5" />
                    <span>X</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="h-px w-full bg-warm-sand" />
        <div className="flex flex-col-reverse items-start justify-between pb-4 pt-6 text-sm md:flex-row md:items-center md:pb-0 md:pt-8 text-muted">
          <p className="mt-6 md:mt-0">© {new Date().getFullYear()} Nsibirwa Family. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
