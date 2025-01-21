"use client";

import NavBar from "@/components/dashboard/navbar";
import UserProvider from "@/provider/userContext/userProvider";
import ProtectedLayout from "./protected-layout";
import Sidebar from "@/components/dashboard/sidebar";
import { ThemeProvider } from "@/provider/themeContext/themeProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <UserProvider>
        <ProtectedLayout>
          <main>
            <NavBar />
            <div className="flex overflow-x-hidden h-[calc(100vh-65px)]">
              <Sidebar />
              <div className="border-l h-full w-full overflow-x-auto overflow-y-auto">
                {children}
              </div>
            </div>
          </main>
        </ProtectedLayout>
      </UserProvider>
    </ThemeProvider>
  );
}
