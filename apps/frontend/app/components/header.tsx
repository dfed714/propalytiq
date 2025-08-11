import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default async function Header() {
  return (
      <header>
          <SignedOut>
              <SignInButton>Sign In</SignInButton>
              <SignUpButton>Sign Up</SignUpButton>
          </SignedOut>
          <SignedIn>
              <UserButton />
          </SignedIn>
      </header>
  );
}