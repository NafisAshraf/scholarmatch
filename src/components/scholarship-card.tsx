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
import Link from "next/link";
import { useAddJSONScholarship } from "@/hooks/useJSONscholarships";
import { useState } from "react";

interface ScholarshipCardProps {
  id: number;
  title: string;
  amount: string;
  status: string;
  country: string;
  subject: string;
  deadline: string;
  source_url: string;
  university: string;
  description: string;
  degree_level: string;
  matching_score: number;
  application_url: string;
  eligibility_criteria: string;
  eligible_nationality: string;
  application_procedure: string;
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
  title,
  amount,
  status,
  country,
  subject,
  deadline,
  source_url,
  university,
  description,
  degree_level,
  matching_score,
  application_url,
  eligibility_criteria,
  eligible_nationality,
  application_procedure,
}: ScholarshipCardProps) {
  const formattedDeadline = deadline ? formatDeadline(deadline) : null;
  const addScholarshipMutation = useAddJSONScholarship();
  const [added, setAdded] = useState(status === "added");

  const handleAdd = () => {
    if (added) return;
    addScholarshipMutation.mutate(
      {
        id,
        title,
        amount,
        status,
        country,
        subject,
        deadline,
        source_url,
        university,
        description,
        degree_level,
        matching_score,
        application_url,
        eligibility_criteria,
        eligible_nationality,
        application_procedure,
      },
      {
        onSuccess: () => setAdded(true),
      }
    );
  };

  return (
    <>
      <Card className="group relative overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-0.25 max-w-md">
        {/* Match Score Badge - Top Right Corner */}
        {matching_score && (
          <div className="absolute top-4 right-4 z-10">
            <Badge className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-0 px-3 py-1">
              <ArrowUpRightIcon className="size-3 mr-1" />
              {matching_score}%
            </Badge>
          </div>
        )}

        <CardHeader className="pb-1">
          <CardTitle className="text-lg font-bold leading-tight line-clamp-2 pr-16">
            {title}
          </CardTitle>

          {/* Amount - Prominent Display */}
          <div className="flex items-center gap-2 mt-2">
            {!amount?.includes("$") && (
              <DollarSignIcon className="size-4 text-cyan-600" />
            )}
            <div className="font-bold text-xl bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              {amount || "Amount TBD"}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3 pb-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* First Column - Country and Degree */}
            <div className="space-y-2">
              {/* Location */}
              {country && (
                <div className="flex items-center gap-1.5">
                  <MapPinIcon className="size-4 text-cyan-600 dark:text-white" />
                  <span className="text-sm font-medium">{country}</span>
                </div>
              )}

              {/* Degree Level */}
              {degree_level && (
                <div className="flex items-center gap-1.5">
                  <GraduationCapIcon className="size-4 text-cyan-600 dark:text-white" />
                  <span className="text-sm font-medium">{degree_level}</span>
                </div>
              )}
            </div>

            {/* Second Column - Deadline */}
            <div className="flex justify-end">
              {formattedDeadline && (
                <div className="text-center px-3 py-2 rounded-lg border bg-slate-50 border-slate-200 dark:bg-transparent dark:border-secondary">
                  <div className="pe-1 flex items-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
                    <CalendarIcon className="size-3" />
                    {formattedDeadline.text}
                  </div>
                  <div className="text-md font-medium">
                    {formattedDeadline.subText}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject Row */}
          {subject && (
            <div className="flex flex-wrap gap-1.5">
              <Badge
                variant="secondary"
                className="bg-cyan-50 dark:bg-cyan-900/50 text-cyan-700 dark:text-cyan-200 border-cyan-200 dark:border-cyan-800 hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-colors text-xs"
              >
                {subject}
              </Badge>
            </div>
          )}

          {/* University */}
          {university && (
            <div className="flex items-center gap-1.5">
              <BookOpenIcon className="size-4 text-cyan-600 dark:text-white" />
              <span className="text-sm font-medium">{university}</span>
            </div>
          )}
        </CardContent>

        <CardFooter className="gap-3 pt-0">
          <Link href={`/scholarship/${id}`}>
            <Button
              variant="outline"
              className="flex-1 group/btn hover:bg-cyan-50 border-slate-200 hover:border-cyan-300 transition-all duration-200"
            >
              <span>View Details</span>
              <ExternalLinkIcon className="size-4 ml-2 group-hover/btn:translate-x-0.5 transition-transform" />
            </Button>
          </Link>

          <Button
            variant="default"
            className="flex-1 transition-all duration-200 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/25"
            onClick={handleAdd}
            disabled={added || addScholarshipMutation.isPending}
          >
            {added ? (
              <CheckIcon className="size-4" />
            ) : (
              <PlusIcon className="size-4" />
            )}
            <span>{added ? "Added" : "Add to Dashboard"}</span>
          </Button>
          {/* Debug: Show mutation state */}
          {/* <div className="text-xs mt-2">
            <div>Status: {addScholarshipMutation.status}</div>
            <div>isPending: {String(addScholarshipMutation.isPending)}</div>
            <div>isSuccess: {String(addScholarshipMutation.isSuccess)}</div>
            <div>isError: {String(addScholarshipMutation.isError)}</div>
            <div>isIdle: {String(addScholarshipMutation.isIdle)}</div>
            {addScholarshipMutation.isError && (
              <div className="text-red-500">
                Error: {addScholarshipMutation.error?.message}
              </div>
            )}
          </div> */}
        </CardFooter>
      </Card>
    </>
  );
}
