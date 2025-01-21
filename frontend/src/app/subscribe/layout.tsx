"use client";

import { ThemeProvider } from "@/provider/themeContext/themeProvider";
import UserProvider from "@/provider/userContext/userProvider";
import ProtectedLayout from "../protected-layout";

const SubscribeLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserProvider>
      <ProtectedLayout>
        <ThemeProvider>
          <UserProvider>{children}</UserProvider>
        </ThemeProvider>
      </ProtectedLayout>
    </UserProvider>
  );
};

export default SubscribeLayout;
