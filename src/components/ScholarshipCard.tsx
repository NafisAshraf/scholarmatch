import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MoreVertical,
  Trash2,
  ExternalLink,
  ArrowUpRight,
  CheckCircle2,
  Circle,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface DBScholarship {
  id: string;
  title: string;
  amount: string;
  status: "matched" | "added";
  country: string;
  subject: string;
  deadline: string;
  documents: {
    cv: any[];
    lor: any[];
    sop: any[];
    others: any[];
    english: any[];
    transcript: any[];
  };
  source_url: string;
  university: string;
  description: string;
  degree_level: string;
  matching_score: number;
  application_url: string;
  eligibility_criteria: string[];
  eligible_nationality: string;
  application_procedure: string[];
  completed?: boolean; // Optional field for tracking completion status
}

interface ScholarshipCardProps {
  scholarship: DBScholarship;
  onRemove: (scholarship: DBScholarship) => void;
  onToggleCompletion?: (scholarship: DBScholarship) => void;
  getDeadlineStatus: (deadline: string) => {
    status: string;
    color: "destructive" | "secondary" | "outline";
    text: string;
  };
}

export function ScholarshipCard({
  scholarship,
  onRemove,
  onToggleCompletion,
  getDeadlineStatus,
}: ScholarshipCardProps) {
  const router = useRouter();
  const deadlineInfo = getDeadlineStatus(scholarship.deadline);
  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const handleApply = () => {
    //go to /dashboard/scholarship/:id
    router.push(`/dashboard/${scholarship.id}`);
    // if (scholarship.application_url) {
    //   window.open(scholarship.application_url, "_blank");
    // }
  };

  return (
    <Card
      className={`backdrop-blur-sm hover:shadow-lg transition-shadow ${
        scholarship.completed ? "bg-green-50/80 dark:bg-green-900/20" : ""
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <h3
                className={`text-lg font-bold truncate ${
                  scholarship.completed
                    ? "text-green-700 dark:text-green-300 line-through"
                    : "text-gray-900 dark:text-white"
                }`}
              >
                {scholarship.title}
              </h3>
              {scholarship.completed && (
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
              )}
            </div>

            <div className="flex items-center gap-4 text-sm mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600 dark:text-gray-300">
                  {formattedDeadline}
                </span>
                <Badge variant={deadlineInfo.color} className="text-xs">
                  {deadlineInfo.text}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <span>{scholarship.university}</span>
              <span>•</span>
              <span>{scholarship.country}</span>
              <span>•</span>
              <span>{scholarship.amount}</span>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
              <DropdownMenuItem
                onClick={() => window.open(scholarship.source_url, "_blank")}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                View Details
              </DropdownMenuItem>
              {onToggleCompletion && (
                <DropdownMenuItem
                  onClick={() => onToggleCompletion(scholarship)}
                >
                  {scholarship.completed ? (
                    <>
                      <Circle className="h-4 w-4 mr-2" />
                      Mark as In Progress
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </>
                  )}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => onRemove(scholarship)}
                className="text-red-600 dark:text-red-400"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {scholarship.degree_level}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {scholarship.subject}
            </Badge>
            {scholarship.matching_score && (
              <Badge variant="secondary" className="text-xs">
                {scholarship.matching_score}% match
              </Badge>
            )}
          </div>

          <Button
            variant="gradient"
            onClick={handleApply}
            disabled={!scholarship.application_url}
            className="flex items-center gap-2"
          >
            <ArrowUpRight className="h-4 w-4" />
            Apply
          </Button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-3 line-clamp-2">
          {scholarship.description}
        </p>
      </CardContent>
    </Card>
  );
}
