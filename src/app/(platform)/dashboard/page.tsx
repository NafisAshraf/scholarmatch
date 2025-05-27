"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Moon, Sun, CheckCircle2, Circle, Trash2 } from "lucide-react";
import { ScholarshipCard, DBScholarship } from "@/components/ScholarshipCard";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "next-themes";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  useJSONScholarships,
  useRemoveJSONScholarship,
} from "@/hooks/useJSONscholarships";

const Index = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tab, setTab] = useState<"all" | "progress" | "completed">("all");
  const { theme, setTheme } = useTheme();

  // Use the hooks for data fetching and mutations
  const { data: scholarships = [], isLoading, error } = useJSONScholarships();
  const removeScholarshipMutation = useRemoveJSONScholarship();

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

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    setTheme(newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  const handleRemoveScholarship = (scholarship: DBScholarship) => {
    removeScholarshipMutation.mutate(scholarship);
  };

  const handleToggleCompletion = (scholarship: DBScholarship) => {
    // For now, we'll just update the local state
    // In a real app, you'd want to persist this to the database
    const updatedScholarship = {
      ...scholarship,
      completed: !scholarship.completed,
    };
    // You would call a mutation here to update the database
    console.log("Toggle completion for:", updatedScholarship);
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

  // Only show scholarships with "added" status in dashboard
  const addedScholarships = scholarships.filter(
    (s: DBScholarship) => s.status === "added"
  );
  const completedCount = addedScholarships.filter(
    (s: DBScholarship) => s.completed
  ).length;
  const progressCount = addedScholarships.filter(
    (s: DBScholarship) => !s.completed
  ).length;
  const totalCount = addedScholarships.length;

  const filteredScholarships = (() => {
    if (tab === "completed")
      return addedScholarships.filter((s: DBScholarship) => s.completed);
    if (tab === "progress")
      return addedScholarships.filter((s: DBScholarship) => !s.completed);
    return addedScholarships;
  })();

  // Sort scholarships by deadline (upcoming first) - only show added scholarships
  const upcomingScholarships = addedScholarships
    .filter((s: DBScholarship) => new Date(s.deadline) >= new Date())
    .sort(
      (a: DBScholarship, b: DBScholarship) =>
        new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
    )
    .slice(0, 5); // Show only top 5 upcoming

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">
            Loading scholarships...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">
            Error loading scholarships
          </p>
          <p className="text-gray-600 dark:text-gray-300">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient">
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gradient">Dashboard</h1>
            <p className="text-gray-800 dark:text-gray-300 mt-2">
              Manage your scholarship applications with ease
            </p>
          </div>
        </div>

        {/* Main Layout: Calendar Sidebar + Main Content */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar: Calendar + Upcoming Deadlines */}
          <div className="md:w-1/3 w-full md:max-w-xs sticky top-8 self-start">
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4 mb-6">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                Calendar
              </h2>
              <Calendar className="w-full" />
            </div>
            <div className="bg-white dark:bg-gray-900 rounded-xl shadow p-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                Upcoming Deadlines
              </h2>
              {upcomingScholarships.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No upcoming deadlines
                </p>
              ) : (
                <ul className="space-y-3">
                  {upcomingScholarships.map((scholarship: DBScholarship) => (
                    <li
                      key={scholarship.id}
                      className="flex items-center justify-between p-2 rounded hover:bg-cyan-50 dark:hover:bg-cyan-900/20 transition"
                    >
                      <span
                        className="font-medium text-gray-800 dark:text-gray-100 truncate max-w-[120px]"
                        title={scholarship.title}
                      >
                        {scholarship.title}
                      </span>
                      <span className="text-xs text-gray-600 dark:text-gray-300 ml-2">
                        {new Date(scholarship.deadline).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Main Dashboard Content */}
          <div className="flex-1 min-w-0">
            {/* Stats as Tabs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card
                className={`cursor-pointer transition ring-2 ring-transparent hover:ring-cyan-400 ${
                  tab === "all"
                    ? "ring-cyan-500 ring-1  dark:bg-cyan-900/20"
                    : ""
                }`}
                onClick={() => setTab("all")}
                tabIndex={0}
                role="button"
                aria-pressed={tab === "all"}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-4 me-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                      <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <div>
                      <p className=" text-gray-600 dark:text-gray-300">
                        All Scholarships
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {totalCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition ring-2 ring-transparent hover:ring-green-400 ${
                  tab === "completed"
                    ? "ring-green-500 ring-1 dark:bg-green-900/20"
                    : ""
                }`}
                onClick={() => setTab("completed")}
                tabIndex={0}
                role="button"
                aria-pressed={tab === "completed"}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-4 me-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className=" text-gray-600 dark:text-gray-300">
                        Completed
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {completedCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card
                className={`cursor-pointer transition ring-2 ring-transparent hover:ring-orange-400 ${
                  tab === "progress"
                    ? "ring-orange-500 ring-1 dark:bg-orange-900/20"
                    : ""
                }`}
                onClick={() => setTab("progress")}
                tabIndex={0}
                role="button"
                aria-pressed={tab === "progress"}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-4 me-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                      <Circle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        In Progress
                      </p>
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">
                        {progressCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scholarships List (Tabbed) */}
            {filteredScholarships.length === 0 ? (
              <Card className="">
                <CardContent className="p-12 text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-cyan-100 to-blue-100 dark:from-cyan-900/30 dark:to-blue-900/30 rounded-full flex items-center justify-center">
                    <CalendarIcon className="h-12 w-12 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tab === "completed"
                      ? "No completed scholarships"
                      : tab === "progress"
                      ? "No scholarships in progress"
                      : "No scholarships yet"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6">
                    {tab === "all"
                      ? "Start by exploring scholarships that match your profile"
                      : "Nothing to see here yet!"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-6">
                {filteredScholarships.map((scholarship: DBScholarship) => (
                  <ScholarshipCard
                    key={scholarship.id}
                    scholarship={scholarship}
                    onRemove={handleRemoveScholarship}
                    onToggleCompletion={handleToggleCompletion}
                    getDeadlineStatus={getDeadlineStatus}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
