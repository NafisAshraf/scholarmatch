"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Moon,
  Sun,
  Calendar,
  CheckCircle2,
  Circle,
  Trash2,
} from "lucide-react";
import { AddScholarshipDialog } from "@/components/AddScholarshipDialog";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Scholarship {
  id: string;
  title: string;
  deadline: string;
  subtasks: Subtask[];
  completed: boolean;
}

const DEFAULT_SCHOLARSHIPS: Scholarship[] = [
  {
    id: "1",
    title: "Google Scholarship Program",
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 10); // 10 days from now
      return d.toISOString().slice(0, 10);
    })(),
    completed: false,
    subtasks: [
      { id: "1a", title: "Upload CV", completed: false },
      { id: "1b", title: "Write SOP (2 pages)", completed: false },
      { id: "1c", title: "Request 2 recommendation letters", completed: false },
    ],
  },
  {
    id: "2",
    title: "Microsoft Diversity Scholarship",
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 3); // 3 days from now
      return d.toISOString().slice(0, 10);
    })(),
    completed: false,
    subtasks: [
      { id: "2a", title: "Fill online application", completed: false },
      {
        id: "2b",
        title: "Email project portfolio to ms-apps@microsoft.com",
        completed: false,
      },
      { id: "2c", title: "Complete diversity essay", completed: false },
    ],
  },
  {
    id: "3",
    title: "MIT International Scholars Grant",
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 20); // 20 days from now
      return d.toISOString().slice(0, 10);
    })(),
    completed: false,
    subtasks: [
      { id: "3a", title: "Find faculty recommender", completed: false },
      { id: "3b", title: "Upload transcripts", completed: false },
      { id: "3c", title: "Write statement of purpose", completed: false },
    ],
  },
  {
    id: "4",
    title: "Women in STEM Award",
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 14);
      return d.toISOString().slice(0, 10);
    })(),
    completed: false,
    subtasks: [
      { id: "4a", title: "Submit official transcripts", completed: false },
      { id: "4b", title: "Write STEM background essay", completed: false },
      { id: "4c", title: "Provide proof of enrollment", completed: false },
    ],
  },
  {
    id: "5",
    title: "International Cultural Exchange Fund",
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 6);
      return d.toISOString().slice(0, 10);
    })(),
    completed: false,
    subtasks: [
      { id: "5a", title: "Proof of language proficiency", completed: false },
      { id: "5b", title: "Submit program proposal", completed: false },
    ],
  },
  {
    id: "6",
    title: "Artistic Excellence Fellowship",
    deadline: (() => {
      const d = new Date();
      d.setDate(d.getDate() + 1);
      return d.toISOString().slice(0, 10);
    })(),
    completed: false,
    subtasks: [
      { id: "6a", title: "Portfolio submission", completed: false },
      { id: "6b", title: "Write artist statement", completed: false },
      { id: "6c", title: "Letter of recommendation", completed: false },
    ],
  },
];

const Index = () => {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [tab, setTab] = useState<"all" | "progress" | "completed">("all");
  const { theme, setTheme } = useTheme();

  // Load theme preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldBeDark = savedTheme === "dark" || (!savedTheme && prefersDark);
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle("dark", shouldBeDark);
  }, []);

  // Load scholarships from localStorage or default
  useEffect(() => {
    // const saved = localStorage.getItem("scholarships");
    // if (saved) {
    //   setScholarships(JSON.parse(saved));
    // } else {
    setScholarships(DEFAULT_SCHOLARSHIPS);
    // }
  }, []);

  // Save scholarships to localStorage
  useEffect(() => {
    localStorage.setItem("scholarships", JSON.stringify(scholarships));
  }, [scholarships]);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const addScholarship = (
    scholarship: Omit<Scholarship, "id" | "completed">
  ) => {
    const newScholarship: Scholarship = {
      ...scholarship,
      id: Date.now().toString(),
      completed: false,
    };
    setScholarships((prev) => [newScholarship, ...prev]);
  };

  const updateScholarship = (id: string, updates: Partial<Scholarship>) => {
    setScholarships((prev) =>
      prev.map((scholarship) =>
        scholarship.id === id ? { ...scholarship, ...updates } : scholarship
      )
    );
  };

  const deleteScholarship = (id: string) => {
    setScholarships((prev) =>
      prev.filter((scholarship) => scholarship.id !== id)
    );
  };

  const toggleSubtask = (scholarshipId: string, subtaskId: string) => {
    setScholarships((prev) =>
      prev.map((scholarship) => {
        if (scholarship.id === scholarshipId) {
          const updatedSubtasks = scholarship.subtasks.map((subtask) =>
            subtask.id === subtaskId
              ? { ...subtask, completed: !subtask.completed }
              : subtask
          );
          const allCompleted = updatedSubtasks.every(
            (subtask) => subtask.completed
          );
          return {
            ...scholarship,
            subtasks: updatedSubtasks,
            completed: allCompleted && updatedSubtasks.length > 0,
          };
        }
        return scholarship;
      })
    );
  };

  const getDeadlineStatus = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0)
      return {
        status: "overdue",
        color: "destructive" as const,
        text: "Overdue",
      };
    if (diffDays === 0)
      return {
        status: "today",
        color: "destructive" as const,
        text: "Due Today",
      };
    if (diffDays <= 7)
      return {
        status: "urgent",
        color: "secondary" as const,
        text: `${diffDays} days left`,
      };
    return {
      status: "normal",
      color: "outline" as const,
      text: `${diffDays} days left`,
    };
  };

  const completedCount = scholarships.filter((s) => s.completed).length;
  const totalCount = scholarships.length;

  const filteredScholarships = (() => {
    if (tab === "completed") return scholarships.filter((s) => s.completed);
    if (tab === "progress") return scholarships.filter((s) => !s.completed);
    return scholarships;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-cyan-900/20 dark:to-blue-900/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
              Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Manage your scholarship applications with ease
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="h-10 w-10"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Scholarship
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <Tabs
            value={tab}
            onValueChange={(v: string) =>
              setTab(v as "all" | "progress" | "completed")
            }
          >
            <TabsList className="gap-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Stats */}
        {totalCount > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Total Applications
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Completed
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {completedCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <Circle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      In Progress
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {totalCount - completedCount}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scholarships List (Tabbed) */}
        {filteredScholarships.length === 0 ? (
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                <Calendar className="h-12 w-12 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {tab === "completed"
                  ? "No completed scholarships"
                  : tab === "progress"
                  ? "No in-progress scholarships"
                  : "No scholarships yet"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {tab === "all"
                  ? "Start tracking your scholarship applications by adding your first one"
                  : "Nothing to see here yet!"}
              </p>
              <Button
                onClick={() => setIsAddDialogOpen(true)}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Scholarship
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredScholarships.map((scholarship) => (
              <ScholarshipCard
                key={scholarship.id}
                scholarship={scholarship}
                onUpdate={(updates) =>
                  updateScholarship(scholarship.id, updates)
                }
                onDelete={() => deleteScholarship(scholarship.id)}
                onToggleSubtask={(subtaskId) =>
                  toggleSubtask(scholarship.id, subtaskId)
                }
                getDeadlineStatus={getDeadlineStatus}
              />
            ))}
          </div>
        )}

        <AddScholarshipDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
          onAdd={addScholarship}
        />
      </div>
    </div>
  );
};

export default Index;
