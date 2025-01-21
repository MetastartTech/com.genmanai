"use client";

import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/provider/themeContext/themeProvider";
import UserProvider from "@/provider/userContext/userProvider";

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <UserProvider>{children}</UserProvider>
      
    </ThemeProvider>
  );
};

export default SigninLayout;
