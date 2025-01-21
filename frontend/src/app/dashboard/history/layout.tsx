"use client";

import NavBar from "@/components/dashboard/navbar";
import UserProvider from "@/provider/userContext/userProvider";
import ProtectedLayout from "../../protected-layout";
import Sidebar from "@/components/dashboard/sidebar";
import { ThemeProvider } from "@/provider/themeContext/themeProvider";
import ImageRequestsProvider from "@/provider/imageRequestsContext/ImageRequestsProvider";

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
            <NavBar type="history" />
            <div className="flex overflow-x-hidden h-[calc(100vh-65px)] overflow-y-hidden">
              <ImageRequestsProvider>
                <Sidebar type="history" />
                <div className="md:border-l h-full w-full overflow-x-hidden">
                  {children}
                </div>
              </ImageRequestsProvider>
            </div>
          </main>
        </ProtectedLayout>
      </UserProvider>
    </ThemeProvider>
  );
}
