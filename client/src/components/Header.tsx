import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

export const Header = () => {
  return (
    <header className="h-16 border-b bg-white/60 backdrop-blur flex items-center justify-between px-4">
      <div className="font-semibold">Dashboard</div>
      <div className="flex items-center gap-2">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton afterSignOutUrl="/sign-in" />
        </SignedIn>
      </div>
    </header>
  );
};
