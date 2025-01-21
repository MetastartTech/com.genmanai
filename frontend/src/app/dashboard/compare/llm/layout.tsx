"use client";

import NavBar from "@/components/dashboard/navbar";
import UserProvider from "@/provider/userContext/userProvider";
import ProtectedLayout from "../../../protected-layout";
import Sidebar from "@/components/dashboard/sidebar";
import { ThemeProvider } from "@/provider/themeContext/themeProvider";
import UserRequestsProvider from "@/provider/userRequestsContext/UserRequestsProvider";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <UserProvider>
        <ProtectedLayout>
          <main className="overflow-y-hidden">
            <NavBar type="llm" />
            <div className="flex overflow-x-hidden h-[calc(100vh-65px)]">
              <Sidebar type="history" />
              <div className="md:border-l h-full w-full overflow-x-hidden">
                {children}
              </div>
            </div>
          </main>
        </ProtectedLayout>
      </UserProvider>
    </ThemeProvider>
  );
}
