"use client";

import {
  ArrowUpRightIcon,
  CalendarIcon,
  MapPinIcon,
  GraduationCapIcon,
  ClockIcon,
  BookOpenIcon,
  DollarSignIcon,
  ExternalLinkIcon,
  PlusIcon,
  CheckIcon,
} from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { useAddTask, StepInput } from "@/hooks/use-add-task";
import Link from "next/link";

interface Country {
  id: number;
  name: string;
}

interface DegreeLevel {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
}

interface FundingType {
  id: number;
  name: string;
}

interface ScholarshipCountry {
  countries: Country;
}

interface ScholarshipDegreeLevel {
  degree_levels: DegreeLevel;
}

interface ScholarshipSubject {
  subjects: Subject;
}

interface ScholarshipFundingType {
  funding_types: FundingType;
}

interface Step {
  name: string;
}

interface Scholarship {
  id: string;
  title: string;
  deadline: string | null;
  amount_max: number | null;
  amount_min: number | null;
  created_at: string;
  source_url: string;
  updated_at: string;
  emoji: string | null;
  description: string | null;
  amount_display: string | null;
  application_url: string | null;
  scholarship_countries: ScholarshipCountry[];
  scholarship_degree_levels: ScholarshipDegreeLevel[];
  scholarship_funding_types: ScholarshipFundingType[];
  scholarship_subjects: ScholarshipSubject[];
  steps: Step[];
}

interface ScholarshipCardProps {
  id: string;
  user_id: string;
  scholarship_id: string;
  match_score: number | null;
  selected: boolean;
  added_at: string;
  scholarships: Scholarship;
}

function formatDeadline(deadline: string) {
  const date = new Date(deadline);
  const now = new Date();
  const daysLeft = Math.ceil(
    (date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (date < now) {
    return {
      text: "Expired",
      subText: "Application closed",
      daysLeft: 0,
    };
  }

  const day = date.getDate();
  const suffix = day === 1 ? "st" : day === 2 ? "nd" : day === 3 ? "rd" : "th";
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return {
    text: `${day}${suffix} ${month} ${year}`,
    subText: `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`,
    daysLeft,
  };
}

export function ScholarshipCard({
  id,
  user_id,
  scholarship_id,
  match_score,
  selected,
  added_at,
  scholarships,
}: ScholarshipCardProps) {
  const deadline = scholarships.deadline
    ? formatDeadline(scholarships.deadline)
    : null;

  const countries = scholarships.scholarship_countries
    .map((c) => c.countries.name)
    .slice(0, 2); // Limit to first 2 countries

  const degreeLevel =
    scholarships.scholarship_degree_levels[0]?.degree_levels.name;
  const subjects = scholarships.scholarship_subjects.slice(0, 3); // Limit to first 3 subjects

  console.log(scholarships.steps);

  const {
    mutate: addTask,
    isPending: isAddingTask,
    isSuccess: isTaskAdded,
  } = useAddTask();

  // Convert scholarships.steps to StepInput[]
  const steps: StepInput[] = (scholarships.steps as any[]).map((step, idx) => ({
    id: step.id ?? idx,
    title: step.title ?? step.name ?? "",
    description: step.description ?? "",
    step_number: step.step_number ?? idx + 1,
    required_doc: step.required_doc ?? null,
    scholarship_id: scholarships.id,
  }));

  return (
    <>
      <Card className="group relative overflow-hidden  border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.25 max-w-md">
        {/* Match Score Badge - Top Right Corner */}
        {match_score && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0  px-3 py-1">
              <ArrowUpRightIcon className="size-3 mr-1" />
              {match_score}%
            </Badge>
          </div>
        )}

        <CardHeader className="pb-1">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 pr-16">
            {scholarships.title}
          </CardTitle>

          {/* Amount - Prominent Display */}
          <div className="flex items-center gap-2 mt-2">
            {!scholarships.amount_display?.includes("$") && (
              <DollarSignIcon className="size-4 text-cyan-600" />
            )}
            <div className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {scholarships.amount_display || "Amount TBD"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Column - Country and Degree */}
            <div className="space-y-2">
              {/* Location */}
              {countries.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-cyan-600 dark:text-white" />
                  <span className="text-sm font-medium">
                    {countries.join(", ")}
                    {scholarships.scholarship_countries.length > 2 && (
                      <span className="text-slate-500 dark:text-white">
                        {" "}
                        +{scholarships.scholarship_countries.length - 2}
                      </span>
                    )}
                  </span>
                </div>
              )}

              {/* Degree Level */}
              {degreeLevel && (
                <div className="flex items-center gap-1.5">
                  <GraduationCapIcon className="size-4 text-cyan-600 dark:text-white" />
                  <span className="text-sm font-medium ">{degreeLevel}</span>
                </div>
              )}
            </div>

            {/* Second Column - Deadline */}
            <div className="flex justify-end">
              {deadline && (
                <div className="text-center px-3 py-2 rounded-lg border bg-slate-50 border-slate-200 dark:bg-transparent dark:border-secondary">
                  <div className="pe-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <CalendarIcon className="size-3" />
                    {deadline.text}
                  </div>
                  <div className="text-md font-medium ">{deadline.subText}</div>
                </div>
              )}
            </div>
          </div>

          {/* Subjects Row */}
          {subjects.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {subjects.map((subject) => (
                <Badge
                  key={subject.subjects.id}
                  variant="secondary"
                  className="bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors text-xs"
                >
                  {subject.subjects.name}
                </Badge>
              ))}
              {scholarships.scholarship_subjects.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 text-xs"
                >
                  +{scholarships.scholarship_subjects.length - 3} more
                </Badge>
              )}
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-3 pt-0">
          <Link href="/scholarship">
            <Button
              variant="outline"
              className="flex-1 group/btn hover:bg-cyan-50 border-slate-200 hover:border-cyan-300 transition-all duration-200"
            >
              <span>View Details</span>
              <ExternalLinkIcon className="size-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>

          <Button
            onClick={() => {
              if (!selected && !isAddingTask && !isTaskAdded) {
                addTask({
                  scholarshipId: scholarships.id,
                  deadline: scholarships.deadline,
                  steps,
                });
              }
            }}
            variant={selected || isTaskAdded ? "secondary" : "default"}
            className={`flex-1 transition-all duration-200 ${
              selected || isTaskAdded
                ? "bg-cyan-50 text-cyan-700 border-cyan-200 hover:bg-cyan-100"
                : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700  shadow-cyan-500/25"
            }`}
            disabled={isAddingTask || selected || isTaskAdded}
          >
            {isAddingTask ? (
              <span>Adding...</span>
            ) : selected || isTaskAdded ? (
              <>
                <CheckIcon className="size-4 mr-2" />
                <span>Added</span>
              </>
            ) : (
              <>
                <PlusIcon className="size-4 mr-2" />
                <span>Add to Tasks</span>
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
      {/* <pre>{JSON.stringify(scholarships.steps, null, 2)}</pre> */}
    </>
  );
}
