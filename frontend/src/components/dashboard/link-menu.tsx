import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Repeat,
  Image as ImageIcon,
  Music,
  History,
  ChevronDown,
} from "lucide-react";
import { usePathname } from "next/navigation";

const LinkMenu = () => {
  const pathname = usePathname();

  const links: { [key: string]: string } = {
    "/dashboard/llm": "LLM",
    "/dashboard/image": "Image",
    "/dashboard/history": "History",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {links[pathname as string] ?? "Open"}{" "}
          <ChevronDown size={16} className="ml-1" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a
              href="/dashboard/llm"
              className={`flex items-center justify-center w-full p-1 rounded-md ${
                pathname.includes("/dashboard/llm") ? "bg-secondary" : ""
              }`}
            >
              <Repeat className="h-4" />
              <span>LLM</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a
              href="/dashboard/image"
              className={`flex items-center justify-center w-full p-1 rounded-md ${
                pathname.includes("/dashboard/image") ? "bg-secondary" : ""
              }`}
            >
              <ImageIcon className="h-4" />
              <span>Image</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <a
              href="/dashboard/history"
              className={`flex items-center justify-center w-full p-1 rounded-md ${
                pathname.includes("/dashboard/history") ? "bg-secondary" : ""
              }`}
            >
              <History className="h-4" />
              <span>History</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LinkMenu;
