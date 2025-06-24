"use client";
import { SignOutButton } from "@clerk/nextjs";
import ForumLogo from "../components/logo/forum-logo";

interface ErrorLayoutProps {
  message?: string;
}

export default function ErrorLayout({ message }: ErrorLayoutProps) {
  return (
    <div className="h-full overflow-hidden flex flex-col items-center justify-center p-8 gap-4 font-[family-name:var(--font-geist-sans)] bg-[#13161d]">
      <ForumLogo />
      <div className="flex flex-col items-center gap-2 justify-center">
        <div className="text-white text-2xl font-semibold">
          Couldn&apos;t load Forvm
        </div>
        <div className="text-gray-400 text-sm">
          {message || "Please try again later."}
        </div>
        <div className="h-10">
          <SignOutButton>
            <button className="border rounded-full p-2 text-xs">
              Sign Out
            </button>
          </SignOutButton>
        </div>
      </div>
    </div>
  );
}
