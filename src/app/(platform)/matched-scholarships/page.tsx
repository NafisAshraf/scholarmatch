"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScholarshipCard } from "@/components/scholarship-card";
import { useUserScholarships } from "@/hooks/use-user-scholarships";

export default function Page() {
  const {
    data: userScholarships,
    isPending: isLoadingUserScholarships,
    error: errorUserScholarships,
  } = useUserScholarships();
  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-cyan-900/20 dark:to-blue-900/20 transition-colors duration-300">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent py-16">
          Choose Your Dream Scholarships
        </h1>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-8 rounded-lg flex items-center gap-2 mt-6 md:mt-0 self-end md:self-auto">
          <Link href="/dashboard">Visit Dashboard</Link>
        </Button>

        <div className="py-16">
          {isLoadingUserScholarships && <p>Loading user scholarships...</p>}

          {errorUserScholarships && (
            <p>
              Error loading user scholarships: {errorUserScholarships.message}
            </p>
          )}
          {userScholarships && userScholarships.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userScholarships.map((scholarship) => (
                <ScholarshipCard
                  key={scholarship.id}
                  id={scholarship.id}
                  user_id={scholarship.user_id}
                  scholarship_id={scholarship.scholarship_id}
                  match_score={scholarship.match_score}
                  selected={scholarship.selected}
                  added_at={scholarship.added_at}
                  scholarships={scholarship.scholarships}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
