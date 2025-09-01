"use client";

import { ThemeProvider } from "next-themes";
import { ThemeToaster } from "@components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <ThemeToaster />
    </ThemeProvider>
  );
}
