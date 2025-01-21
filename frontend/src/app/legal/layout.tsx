"use client";

import Header from "@/components/common/header";
import Footer from "@/components/landing/footer";
import { ThemeProvider } from "@/provider/themeContext/themeProvider";

const LegalLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <Header />
      {children}
      <Footer />
    </ThemeProvider>
  );
};

export default LegalLayout;
