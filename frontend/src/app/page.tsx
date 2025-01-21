import Header from "@/components/common/header";
import { ThemeProvider } from "@/provider/themeContext/themeProvider";

export default function Home() {
  return (
    <ThemeProvider>
      <Header />
      <main>Hello GenMan</main>;
    </ThemeProvider>
  );
}
