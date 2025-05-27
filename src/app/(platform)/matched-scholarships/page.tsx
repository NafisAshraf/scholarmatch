"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ScholarshipCard } from "@/components/scholarship-card";
import { useJSONScholarships } from "@/hooks/useJSONscholarships";
import ProfileQuestions from "@/components/profile-questions";

export default function Page() {
  const {
    data: userScholarships,
    isPending: isLoadingUserScholarships,
    error: errorUserScholarships,
  } = useJSONScholarships();

  if (isLoadingUserScholarships) {
    return <p>Loading user scholarships...</p>;
  }

  if (errorUserScholarships) {
    return (
      <p>Error loading user scholarships: {errorUserScholarships.message}</p>
    );
  }

  if (!userScholarships || userScholarships.length === 0) {
    return <ProfileQuestions />;
  }

  return (
    <>
      <div className="min-h-screen flex flex-col items-center py-16 bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-cyan-900/20 dark:to-blue-900/20 transition-colors duration-300">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent py-12 text-center">
          Choose Your Dream Scholarships
        </h1>
        <Button className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-8 rounded-lg flex items-center gap-2  mt-0 ">
          <Link href="/dashboard">Visit Dashboard</Link>
        </Button>

        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-10">
            {userScholarships.map((scholarship: any) => (
              <ScholarshipCard
                key={scholarship.id}
                id={scholarship.id}
                title={scholarship.title}
                amount={scholarship.amount}
                status={scholarship.status}
                country={scholarship.country}
                subject={scholarship.subject}
                deadline={scholarship.deadline}
                documents={scholarship.documents}
                source_url={scholarship.source_url}
                university={scholarship.university}
                description={scholarship.description}
                degree_level={scholarship.degree_level}
                matching_score={scholarship.matching_score}
                application_url={scholarship.application_url}
                eligibility_criteria={scholarship.eligibility_criteria}
                eligible_nationality={scholarship.eligible_nationality}
                application_procedure={scholarship.application_procedure}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
