"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTab } from "@/components/admin/users-tab";
import { MentorsTab } from "@/components/admin/mentors-tab";
import { Users, UserCheck, GraduationCap, Calendar } from "lucide-react";
import { LogoutButton } from "@/components/logout-button";

const supabase = createClient();

async function fetchDashboardStats() {
  const [usersResult, mentorsResult, appointmentsResult] = await Promise.all([
    supabase
      .from("users")
      .select("id", { count: "exact", head: true })
      .eq("aud", "authenticated"),
    supabase.from("mentors").select("user_id", { count: "exact", head: true }),
    supabase.from("appointments").select("id", { count: "exact", head: true }),
  ]);

  const [verifiedMentorsResult] = await Promise.all([
    supabase
      .from("mentors")
      .select("user_id", { count: "exact", head: true })
      .eq("verified", true),
  ]);

  return {
    totalUsers: usersResult.count || 0,
    totalMentors: mentorsResult.count || 0,
    verifiedMentors: verifiedMentorsResult.count || 0,
    totalAppointments: appointmentsResult.count || 0,
  };
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: fetchDashboardStats,
  });

  return (
    <div className="">
      <div className="space-y-6 py-10 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-bold ">Admin Panel</h1>
          <p className="text-muted-foreground">
            Manage users, mentors, and view analytics
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalUsers.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered students
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Mentors
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.totalMentors.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                All mentor applications
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Verified Mentors
              </CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? "..." : stats?.verifiedMentors.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">Approved mentors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Appointments
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading
                  ? "..."
                  : stats?.totalAppointments.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                Scheduled sessions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList>
            <TabsTrigger value="mentors">Mentors</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="mentors" className="space-y-4">
            <MentorsTab />
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <UsersTab />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex justify-center items-center">
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
