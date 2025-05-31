"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ChevronLeft, ChevronRight, User, Calendar, Globe } from "lucide-react";
import { format } from "date-fns";

const supabase = createClient();

interface UserProfile {
  user_id: string;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  updated_at: string;
  scholarships: any | null;
  documents: any | null;
  profile: string | null;
}

async function fetchUserProfiles(page: number, limit: number = 10) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("updated_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return { data: data || [], count: count || 0 };
}

export function UsersTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProfile, setSelectedProfile] = useState<UserProfile | null>(
    null
  );
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const limit = 10;

  const { data, isLoading, error } = useQuery({
    queryKey: ["user-profiles", currentPage],
    queryFn: () => fetchUserProfiles(currentPage, limit),
  });

  const totalPages = Math.ceil((data?.count || 0) / limit);

  const handleProfileClick = (profile: UserProfile) => {
    setSelectedProfile(profile);
    setIsSheetOpen(true);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-destructive">
            Error loading user profiles: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>User Profiles ({data?.count || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User ID</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Nationality</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Profile Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((profile) => {
                    const isComplete =
                      profile.date_of_birth &&
                      profile.gender &&
                      profile.nationality;
                    return (
                      <TableRow
                        key={profile.user_id}
                        className="cursor-pointer hover:bg-muted/50"
                        onClick={() => handleProfileClick(profile)}
                      >
                        <TableCell className="font-medium">
                          <div className="flex items-center space-x-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-mono text-xs">
                              {profile.user_id.substring(0, 8)}...
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {profile.gender || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {profile.nationality || "Not specified"}
                        </TableCell>
                        <TableCell>
                          {profile.date_of_birth
                            ? format(
                                new Date(profile.date_of_birth),
                                "MMM dd, yyyy"
                              )
                            : "Not provided"}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isComplete ? "default" : "secondary"}>
                            {isComplete ? "Complete" : "Incomplete"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {format(new Date(profile.updated_at), "MMM dd, yyyy")}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, data?.count || 0)} of{" "}
                  {data?.count || 0} profiles
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePreviousPage}
                    disabled={currentPage <= 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    <span className="text-sm">
                      Page {currentPage} of {totalPages}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage >= totalPages}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Profile Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent className="w-[500px] sm:w-[600px] rounded-l-lg">
          <SheetHeader>
            <SheetTitle>User Profile Details</SheetTitle>
          </SheetHeader>
          {selectedProfile && (
            <div className="space-y-6 py-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        User ID:
                      </span>
                      <span className="text-sm font-mono">
                        {selectedProfile.user_id}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Date of Birth:
                      </span>
                      <span className="text-sm">
                        {selectedProfile.date_of_birth
                          ? format(
                              new Date(selectedProfile.date_of_birth),
                              "PPP"
                            )
                          : "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Gender:
                      </span>
                      <span className="text-sm">
                        {selectedProfile.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Nationality:
                      </span>
                      <span className="text-sm">
                        {selectedProfile.nationality || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Profile Status</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Completion Status:
                      </span>
                      <Badge
                        variant={
                          selectedProfile.date_of_birth &&
                          selectedProfile.gender &&
                          selectedProfile.nationality
                            ? "default"
                            : "secondary"
                        }
                      >
                        {selectedProfile.date_of_birth &&
                        selectedProfile.gender &&
                        selectedProfile.nationality
                          ? "Complete"
                          : "Incomplete"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Last Updated:
                      </span>
                      <span className="text-sm">
                        {format(new Date(selectedProfile.updated_at), "PPP pp")}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedProfile.profile && (
                  <div>
                    <h3 className="text-lg font-semibold">
                      Profile Description
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {selectedProfile.profile}
                      </p>
                    </div>
                  </div>
                )}

                {selectedProfile.scholarships && (
                  <div>
                    <h3 className="text-lg font-semibold">Scholarships Data</h3>
                    <div className="mt-2">
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(selectedProfile.scholarships, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}

                {selectedProfile.documents && (
                  <div>
                    <h3 className="text-lg font-semibold">Documents Data</h3>
                    <div className="mt-2">
                      <pre className="text-xs bg-muted p-2 rounded overflow-auto">
                        {JSON.stringify(selectedProfile.documents, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
