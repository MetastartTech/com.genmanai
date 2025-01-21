"use client";

import { usePathname } from "next/navigation";

interface INavLink {
  href: string;
  text: string;
}

const NavLink: React.FC<INavLink> = ({ href, text }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={`transition-colors hover:text-foreground/80 ${
        isActive ? "text-foreground" : "text-foreground/60"
      }`}
    >
      {text}
    </a>
  );
};

export default NavLink;
