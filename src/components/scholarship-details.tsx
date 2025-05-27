"use client";
import Progress from "@/components/progress";
import {
  useJSONScholarships,
  useAddJSONScholarship,
} from "@/hooks/useJSONscholarships";
import { useParams } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { PlusIcon } from "lucide-react";
import { useState, useEffect } from "react";

export default function ScholarshipPage() {
  const { data: scholarships, isPending } = useJSONScholarships();
  const { id } = useParams();
  const scholarship = scholarships?.find(
    (scholarship: any) => scholarship.id === id
  );
  const [added, setAdded] = useState(false);
  const addScholarshipMutation = useAddJSONScholarship();

  useEffect(() => {
    if (scholarship) {
      setAdded(scholarship.status === "added");
    }
  }, [scholarship]);

  const handleAdd = () => {
    if (added) return;
    addScholarshipMutation.mutate(
      {
        ...scholarship,
      },
      {
        onSuccess: () => setAdded(true),
      }
    );
  };

  if (isPending) {
    return <div>Loading scholarship details...</div>;
  }

  if (!scholarship) {
    return <div>Scholarship not found</div>;
  }

  const deadlineDate = new Date(scholarship.deadline);

  return (
    <div className="flex gap-4 px-4 py-16">
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex flex-col gap-8">
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{scholarship.title}</h1>
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
                <span>{deadlineDate.toLocaleDateString()}</span>
              </div>
            </div>
            <div>
              <div className="bg-orange-100 rounded-lg p-6 text-center h-full">
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="text-2xl text-orange-600 mb-1">
                    {Math.ceil(
                      (deadlineDate.getTime() - new Date().getTime()) /
                        (1000 * 60 * 60 * 24)
                    ) < 0
                      ? "Expired"
                      : "Expires in"}
                  </div>
                  {Math.ceil(
                    (deadlineDate.getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24)
                  ) >= 0 && (
                    <>
                      <div className="text-4xl font-bold text-orange-600">
                        {Math.ceil(
                          (deadlineDate.getTime() - new Date().getTime()) /
                            (1000 * 60 * 60 * 24)
                        )}
                      </div>
                      <div className="text-sm text-orange-600">Days</div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <section className="space-y-3">
              <h2 className="text-2xl font-semibold">Description</h2>
              <p className="">{scholarship.description}</p>
            </section>

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
      {/* Fixed calendar section */}
      <div className="sticky top-4 h-fit right-10">
        <div className="bg-white dark:bg-gray-800 rounded-lg border p-4">
          <p className="text-xl text-start font-bold pb-3 ps-5">Deadline</p>
          <Calendar
            mode="single"
            selected={deadlineDate}
            onSelect={() => {}}
            className="w-full"
            month={deadlineDate}
          />
        </div>
        {/* <Button
          variant="gradient"
          className="w-full mt-4"
          onClick={handleAdd}
          disabled={added || addScholarshipMutation.isPending}
        >
          {added ? (
            <CheckIcon className="size-4" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          <span>{added ? "Added" : "Add to Dashboard"}</span>
        </Button> */}
      </div>
    </div>
  );
}
