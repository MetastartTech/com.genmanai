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
          <main className="overflow-y-hidden">
            <ImageRequestsProvider>
              <NavBar type="image" />
              <div className="flex overflow-x-hidden overflow-y-hidden h-[calc(100vh-65px)]">
                <Sidebar type="image" />
                <div className="md:border-l h-full w-full overflow-x-hidden">
                  {children}
                </div>
              </div>
            </ImageRequestsProvider>
          </main>
        </ProtectedLayout>
      </UserProvider>
    </ThemeProvider>
  );
}
