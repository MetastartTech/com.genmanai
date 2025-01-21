"use client";

import ModeToggle from "../common/mode-toggle";
import UserMenu from "../common/user-menu";
import ThemeToggle from "../common/theme-toggle";
import MobileDrawer from "./mobile-drawer";
import LinkMenu from "./link-menu";
import NewRequestModal from "../llm/new-request-modal";
import NewImageRequestModal from "../image/new-request-modal";
import useUserRequests from "@/provider/userRequestsContext/useUserRequestsContext";
import useImageRequests from "@/provider/imageRequestsContext/useImageRequestsContext";
import UsageModal from "./usage-modal";
import FeedbackModal from "./feedback-modal";

interface INavbar {
  type: "llm" | "history" | "image";
}

const NavBar: React.FC<INavbar> = ({ type }) => {
  const { handleAddNewRequest } = useUserRequests();
  const { handleAddNewRequest: handleAddImageRequest } = useImageRequests();

  return (
    <header className="supports-backdrop-blur:bg-background/60 top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-12 md:h-16 items-center justify-between px-5 md:px-10">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6" href="/">
            <span className="hidden font-bold sm:inline-block text-lg">
              GenMan
            </span>
          </a>
        </div>
        <div className="md:hidden">
          <MobileDrawer type={type} />
        </div>
        <div className="md:hidden">
          <LinkMenu />
        </div>
        {type !== "history" ? (
          <div className="md:hidden">
            {type === "llm" ? (
              <NewRequestModal addRequest={handleAddNewRequest} />
            ) : (
              <NewImageRequestModal addRequest={handleAddImageRequest} />
            )}
          </div>
        ) : null}
        <div className="hidden md:flex items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center gap-4">
            <ModeToggle />
            <ThemeToggle />
            <UserMenu />
            <UsageModal />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
