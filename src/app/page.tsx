import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="flex flex-col gap-4 items-center">
          <h2 className="text-2xl font-bold text-center">
            Welcome to ScholarMatch
          </h2>
          <p className="text-center">
            Get started by logging in or signing up.
          </p>
          <div className="flex gap-4">
            <Link href="/auth/login" rel="noopener noreferrer">
              <Button className="">Login</Button>
            </Link>
            <Link href="/auth/sign-up" rel="noopener noreferrer">
              <Button variant={"outline"}>Sign up</Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
