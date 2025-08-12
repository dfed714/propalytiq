import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Toaster } from "sonner";
import { Toaster as Sonner } from "@ui/sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Toaster />
          <Sonner />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
