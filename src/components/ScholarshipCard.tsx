import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Calendar,
  CheckCircle2,
  Circle,
  MoreVertical,
  Trash2,
  Edit,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Scholarship, Subtask } from "@/app/(platform)/tasks/page";
import { EditScholarshipDialog } from "@/components/EditScholarshipDialog";

interface ScholarshipCardProps {
  scholarship: Scholarship;
  onUpdate: (updates: Partial<Scholarship>) => void;
  onDelete: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  getDeadlineStatus: (deadline: string) => {
    status: string;
    color: "destructive" | "secondary" | "outline";
    text: string;
  };
}

export function ScholarshipCard({
  scholarship,
  onUpdate,
  onDelete,
  onToggleSubtask,
  getDeadlineStatus,
}: ScholarshipCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const completedSubtasks = scholarship.subtasks.filter(
    (st) => st.completed
  ).length;
  const totalSubtasks = scholarship.subtasks.length;
  const progress =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  const deadlineInfo = getDeadlineStatus(scholarship.deadline);
  const formattedDeadline = new Date(scholarship.deadline).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <>
      <Card
        className={` ${
          scholarship.completed ? "bg-green-50/80 dark:bg-green-900/20" : ""
        } backdrop-blur-sm`}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3
                  className={`text-lg font-bold transition-colors ${
                    scholarship.completed
                      ? "text-green-700 dark:text-green-300 line-through"
                      : "text-gray-900 dark:text-white"
                  }`}
                >
                  {scholarship.title}
                </h3>
                {scholarship.completed && (
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                )}
              </div>

              <div className="flex items-center gap-4 text-sm">
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
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              >
                <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="text-red-600 dark:text-red-400"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {totalSubtasks > 0 && (
            <div className="space-y-2 pt-5 px-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">
                  Progress: {completedSubtasks}/{totalSubtasks} tasks
                </span>
                <span className="text-gray-600 dark:text-gray-300">
                  {Math.round(progress)}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardHeader>

        {totalSubtasks > 0 && (
          <CardContent className="pt-0">
            <Button
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="w-full justify-start text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              {isExpanded ? "Hide" : "Show"} Tasks ({totalSubtasks})
            </Button>

            {isExpanded && (
              <div className="mt-4 space-y-3">
                {scholarship.subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-start gap-3 p-3 rounded-lg  hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors"
                  >
                    <Checkbox
                      checked={subtask.completed}
                      onCheckedChange={() => onToggleSubtask(subtask.id)}
                      className="mt-0.5"
                    />
                    <span
                      className={`flex-1 text-sm ${
                        subtask.completed
                          ? "line-through text-gray-500 dark:text-gray-400"
                          : "text-gray-700 dark:text-gray-200"
                      }`}
                    >
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        )}

        {totalSubtasks === 0 && (
          <CardContent className="pt-0">
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              <Circle className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No application steps added yet</p>
            </div>
          </CardContent>
        )}
      </Card>

      <EditScholarshipDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        scholarship={scholarship}
        onUpdate={onUpdate}
      />
    </>
  );
}
