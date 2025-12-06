"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import React, { useState } from "react";
import {
  BiLogoFacebookCircle,
  BiLogoInstagram,
  BiLogoLinkedinSquare,
  BiLogoYoutube,
} from "react-icons/bi";
import { FaXTwitter } from "react-icons/fa6";

const useForm = () => {
  const [email, setEmail] = useState("");
  const handleSetEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ email });
  };
  return {
    email,
    handleSetEmail,
    handleSubmit,
  };
};

export function Footer() {
  const formState = useForm();
  return (
    <footer id="relume" className="py-12 md:py-18 lg:py-20 bg-cream border-t border-warm-sand">
      <div className="container">
        <div className="grid grid-cols-1 gap-x-[8vw] gap-y-12 pb-12 md:gap-y-16 md:pb-18 lg:grid-cols-[0.75fr_1fr] lg:gap-y-4 lg:pb-20">
          <div className="flex flex-col">
            <a href="/" className="mb-5 md:mb-6">
               <span className="font-serif font-bold text-2xl text-deep-umber">MLN Museum</span>
            </a>
            <p className="mb-5 md:mb-6 text-deep-umber">Preserving and celebrating the life and contributions of Owek. Martin Luther Nsibirwa and his descendants.</p>
            <div className="w-full max-w-md">
              <form
                className="mb-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-[1fr_max-content] md:gap-y-4"
                onSubmit={formState.handleSubmit}
              >
                <Input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={formState.email}
                  onChange={formState.handleSetEmail}
                />
                <Button title="Subscribe" variant="secondary" size="sm">
                  Subscribe
                </Button>
              </form>
              <p className="text-xs text-muted">
                We respect your privacy and only send what matters.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 items-start gap-y-10 sm:grid-cols-3 sm:gap-x-6 md:gap-x-8 md:gap-y-4">
            <div className="flex flex-col items-start justify-start">
              <h2 className="mb-3 font-semibold md:mb-4 text-deep-umber">Explore</h2>
              <ul>
                <li className="py-2 text-sm">
                  <a href="/mln-story" className="flex items-center gap-3 hover:text-burgundy">
                    <span>MLN Biography</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="/tree" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Family tree</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="/gallery" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Gallery</span>
                  </a>
                </li>
                <li className="py-2 text-sm">
                  <a href="/search" className="flex items-center gap-3 hover:text-burgundy">
                    <span>Search</span>
                  </a>
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

