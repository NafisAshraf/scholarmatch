import { SignUpForm } from "@/components/sign-up-form";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className="w-full flex justify-center pb-10">
          <Link href="/">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 bg-button text-white rounded-md p-[5px]" />
              <span className="text-2xl font-bold text-gradient">
                ScholarMatch
              </span>
            </div>
          </Link>
        </div>
        <SignUpForm />
      </div>
    </div>
  );
}
