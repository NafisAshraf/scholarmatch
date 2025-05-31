"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import {
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Star,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

const supabase = createClient();

interface Mentor {
  user_id: string;
  name: string;
  email: string;
  profile_pic: string | null;
  date_of_birth: string | null;
  gender: string | null;
  nationality: string | null;
  languages: string[];
  profession: string | null;
  scholarship: string | null;
  bio: string | null;
  rating_average: number | null;
  rating_count: number | null;
  linkedin: string | null;
  gmail: string | null;
  drive_link: string | null;
  country: string | null;
  verified: boolean | null;
  session_count: number | null;
}

async function fetchMentors(page: number, limit: number = 10) {
  const offset = (page - 1) * limit;

  const { data, error, count } = await supabase
    .from("mentors")
    .select("*", { count: "exact" })
    .order("verified", { ascending: true })
    .order("name", { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;

  return { data: data || [], count: count || 0 };
}

async function updateMentorVerification(userId: string, verified: boolean) {
  const { error } = await supabase
    .from("mentors")
    .update({ verified })
    .eq("user_id", userId);

  if (error) throw error;
  return { userId, verified };
}

export function MentorsTab() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const limit = 10;
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["mentors", currentPage],
    queryFn: () => fetchMentors(currentPage, limit),
  });

  const verificationMutation = useMutation({
    mutationFn: ({ userId, verified }: { userId: string; verified: boolean }) =>
      updateMentorVerification(userId, verified),
    onSuccess: ({ verified }) => {
      queryClient.invalidateQueries({ queryKey: ["mentors"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      toast.success(
        `Mentor ${verified ? "approved" : "rejected"} successfully`
      );
      setIsSheetOpen(false);
    },
    onError: (error) => {
      toast.error(`Failed to update mentor: ${error.message}`);
    },
  });

  const totalPages = Math.ceil((data?.count || 0) / limit);

  const handleMentorClick = (mentor: Mentor) => {
    setSelectedMentor(mentor);
    setIsSheetOpen(true);
  };

  const handleApprove = () => {
    if (selectedMentor) {
      verificationMutation.mutate({
        userId: selectedMentor.user_id,
        verified: true,
      });
    }
  };

  const handleReject = () => {
    if (selectedMentor) {
      console.log("Reject mentor:", selectedMentor.user_id);
      // For now, just console log as requested
      // In the future, you might want to set verified to false or handle differently
    }
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
            Error loading mentors: {error.message}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Mentors ({data?.count || 0})</CardTitle>
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
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Country</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data.map((mentor) => (
                    <TableRow
                      key={mentor.user_id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleMentorClick(mentor)}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="h-4 w-4 text-muted-foreground" />
                          <span>{mentor.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{mentor.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={mentor.verified ? "default" : "secondary"}
                        >
                          {mentor.verified ? "Verified" : "Pending"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span>
                            {mentor.rating_average
                              ? mentor.rating_average.toFixed(1)
                              : "0.0"}
                          </span>
                          <span className="text-muted-foreground">
                            ({mentor.rating_count || 0})
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{mentor.session_count || 0}</TableCell>
                      <TableCell>{mentor.country || "Not specified"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * limit + 1} to{" "}
                  {Math.min(currentPage * limit, data?.count || 0)} of{" "}
                  {data?.count || 0} mentors
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

      {/* Mentor Details Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="w-[400px] sm:w-[600px] rounded-l-lg py-10 px-5"
          side="right"
        >
          <SheetHeader>
            <SheetTitle>
              <p className="text-2xl font-bold ">Mentor Details</p>
            </SheetTitle>
          </SheetHeader>
          {selectedMentor && (
            <div className="space-y-6 px-5 py-3 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold">Basic Information</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Name:
                      </span>
                      <span className="text-sm">{selectedMentor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Email:
                      </span>
                      <span className="text-sm">{selectedMentor.email}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Profession:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.profession || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Country:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.country || "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Personal Details</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Gender:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.gender || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Nationality:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.nationality || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Date of Birth:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.date_of_birth
                          ? format(
                              new Date(selectedMentor.date_of_birth),
                              "PPP"
                            )
                          : "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Languages:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.languages.length > 0
                          ? selectedMentor.languages.join(", ")
                          : "Not specified"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Professional Info</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Scholarship:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.scholarship || "Not specified"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        LinkedIn:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.linkedin ? (
                          <a
                            href={selectedMentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Profile
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Drive Link:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.drive_link ? (
                          <a
                            href={selectedMentor.drive_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            View Documents
                          </a>
                        ) : (
                          "Not provided"
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold">Mentoring Stats</h3>
                  <div className="space-y-2 mt-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Verification Status:
                      </span>
                      <Badge
                        variant={
                          selectedMentor.verified ? "default" : "secondary"
                        }
                      >
                        {selectedMentor.verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Rating:
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm">
                          {selectedMentor.rating_average
                            ? selectedMentor.rating_average.toFixed(1)
                            : "0.0"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({selectedMentor.rating_count || 0} reviews)
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        Sessions Completed:
                      </span>
                      <span className="text-sm">
                        {selectedMentor.session_count || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {selectedMentor.bio && (
                  <div>
                    <h3 className="text-lg font-semibold">Bio</h3>
                    <p className="text-sm text-muted-foreground mt-2">
                      {selectedMentor.bio}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-4 border-t">
                <Button
                  onClick={handleApprove}
                  disabled={
                    selectedMentor.verified || verificationMutation.isPending
                  }
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {verificationMutation.isPending ? "Approving..." : "Approve"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
