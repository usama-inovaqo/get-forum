import Image from "next/image";
import Link from "next/link";
import { Button } from "./components/buttons/button";

export default function RootContent() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#13161d]">
      <div className="w-full flex justify-between items-center p-4 sm:p-6">
        <a href="/conversations" rel="noopener noreferrer">
          <Image src="/forum-logo.png" alt="Forum logo" width={50} height={50} priority />
        </a>

        <Link
          className="text-white text-sm font-semibold"
          href="/login"
          rel="noopener noreferrer"
        >
          Try forum.
        </Link>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center text-left">
        <div className="grid grid-cols-2">
          <div className="col-span-1">&nbsp;</div>
          <div className="col-span-1 flex flex-col gap-4 justify-center">
            <div className="flex flex-col gap-2">
              <h1 className="text-6xl font-bold">Stay on top, on the go.</h1>
              <p className="text-lg font-medium">
                Emails, messages, all in one place.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="white" size="lg">
                See pricing
              </Button>
              <Link href="/login">
                <Button variant="pink" size="lg">
                  Try forum
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="text-sm text-center text-foreground">
        &nbsp;
      </footer>
    </div>
  );
}
