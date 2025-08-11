// app/layout.tsx
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import './globals.css';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <header style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1rem', borderBottom: '1px solid #ccc' }}>
            <SignedOut>
              <SignInButton>
                <button style={{ padding: '0.5rem 1rem' }}>Sign In</button>
              </SignInButton>
              <SignUpButton>
                <button style={{ padding: '0.5rem 1rem' }}>Sign Up</button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          <main style={{ padding: '1rem' }}>
            {children}
          </main>
        </body>
      </html>
    </ClerkProvider>
  );
}
