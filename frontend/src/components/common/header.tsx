"use client";

import useUser from "@/provider/userContext/useUserContext";
import { Button } from "../ui/button";
import ModeToggle from "./mode-toggle";
import ThemeToggle from "./theme-toggle";
import { usePathname } from "next/navigation";
import Image from "next/image";

const Header: React.FC = () => {
  const { user } = useUser();
  const pathName = usePathname();

  let showThemeToggle = false;
  if (pathName !== "/") {
    showThemeToggle = true;
  }

  const handleClick = (e: any, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
    });
  };
  return (
    <header className="supports-backdrop-blur:bg-background/60 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-20 items-center justify-between">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6" href="/">
            <span className="hidden font-bold sm:inline-block text-xl">
              {" "}
              GenMan
            </span>
          </a>
          <nav className="flex items-center space-x-6 font-medium text-sm">
            <div
              className="cursor-pointer"
              onClick={(e: any) => handleClick(e, "about")}
            >
              About
            </div>
            <div
              className="cursor-pointer"
              onClick={(e: any) => handleClick(e, "features")}
            >
              Features
            </div>

            <div
              className="cursor-pointer"
              onClick={(e: any) => handleClick(e, "pricing")}
            >
              Pricing
            </div>
          </nav>
        </div>
        <button
          className="inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:text-accent-foreground h-9 py-2 mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
          type="button"
          aria-haspopup="dialog"
          aria-expanded="false"
          aria-controls="radix-:R15hja:"
          data-state="closed"
        >
          {/* <svg
            width="15"
            height="15"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
          >
            <path
              d="M8 2H13.5C13.7761 2 14 2.22386 14 2.5V12.5C14 12.7761 13.7761 13 13.5 13H8V2ZM7 2H1.5C1.22386 2 1 2.22386 1 2.5V12.5C1 12.7761 1.22386 13 1.5 13H7V2ZM0 2.5C0 1.67157 0.671573 1 1.5 1H13.5C14.3284 1 15 1.67157 15 2.5V12.5C15 13.3284 14.3284 14 13.5 14H1.5C0.671573 14 0 13.3284 0 12.5V2.5Z"
              fill="currentColor"
              fillRule="evenodd"
              clipRule="evenodd"
            ></path>
          </svg> */}
          {/* <Image
            src="/android-chrome-192x192.png"
            width={40}
            height={40}
            alt="GM"
          /> */}
          <a
            href="/"
            className="tracking-tighter font-bold text-xl cursor-pointer"
          >
            GenMan
          </a>
          <span className="sr-only">Toggle Menu</span>
        </button>
        <div className="float-right md:flex md:flex-1 md:items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-2 md:gap-4">
            {showThemeToggle && (
              <div className="flex mr-2">
                <div className="mr-2">
                  <ModeToggle />
                </div>
                <ThemeToggle />
              </div>
            )}
            <a
              href={user ? "/dashboard/llm" : "/signin"}
              // className="fixed right-2 md:static md:right-auto"
            >
              <Button>{user ? "Dashboard" : "Signin"}</Button>
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
