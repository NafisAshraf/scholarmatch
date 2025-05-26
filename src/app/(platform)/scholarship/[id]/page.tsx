"use client";
import Progress from "@/components/progress";
import { useJSONScholarships } from "@/hooks/useJSONscholarships";
import { useParams } from "next/navigation";

export default function ScholarshipPage() {
  const { data: scholarships, isPending } = useJSONScholarships();
  const { id } = useParams();
  const scholarship = scholarships?.[parseInt(id as string)];

  if (isPending) {
    return <div>Loading scholarship details...</div>;
  }

  if (!scholarship) {
    return <div>Scholarship not found</div>;
  }

  return (
    <div className="flex gap-4 px-4 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{scholarship.title}</h1>
            <p className="text-muted-foreground">{scholarship.description}</p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">💲</span>
                <span>{scholarship.amount}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🏛️</span>
                <span>{scholarship.university}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🎓</span>
                <span>{scholarship.degree_level}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📚</span>
                <span>{scholarship.subject}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">🌎</span>
                <span>{scholarship.eligible_nationality}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📍</span>
                <span>{scholarship.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">📅</span>
                <span>
                  {new Date(scholarship.deadline).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 rounded-lg p-6 text-center h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-2xl text-orange-600 mb-1">
                    Expires in
                  </div>
                  <div className="text-4xl font-bold text-orange-600">
                    {Math.ceil(
                      (new Date(scholarship.deadline).getTime() -
                        new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </div>
                  <div className="text-sm text-orange-600">Days</div>
                </div>
                {/* <a
                  href={scholarship.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Apply Now
                </a> */}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Eligibility Criteria</h2>
              <ul className="list-disc pl-6 space-y-2">
                {scholarship.eligibility_criteria.map(
                  (criteria: string, index: number) => (
                    <li key={index}>{criteria}</li>
                  )
                )}
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Application Process</h2>
              <ol className="list-decimal pl-6 space-y-2">
                {scholarship.application_procedure.map(
                  (step: string, index: number) => (
                    <li key={index}>{step}</li>
                  )
                )}
              </ol>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
