"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { LogoutButton } from "@/components/logout-button";
import { createClient } from "@/lib/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  ClockIcon,
  TrashIcon,
  PlusIcon,
  CalendarIcon,
  UserIcon,
  CheckCircleIcon,
} from "lucide-react";
import { toast } from "sonner";

interface Timeslot {
  id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_recurring: boolean;
}

interface Appointment {
  id: string;
  created_at: string;
  timeslots: {
    day_of_week: number;
    start_time: string;
    end_time: string;
    date: string;
  };
  users: {
    email: string;
    raw_user_meta_data: {
      name?: string;
    };
  };
}

interface MentorProfile {
  name: string;
  email: string;
  profile_pic?: string;
  date_of_birth?: string;
  gender?: string;
  nationality?: string;
  languages: string[];
  profession?: string;
  scholarship?: string;
  bio?: string;
  linkedin?: string;
  gmail?: string;
  drive_link?: string;
  country?: string;
}

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default function MentorDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [profileData, setProfileData] = useState<MentorProfile | null>(null);
  const [newTimeslot, setNewTimeslot] = useState({
    day_of_week: "",
    start_time: "",
    end_time: "",
  });

  // Query for user authentication
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error || !data?.user) {
        throw new Error("Not authenticated");
      }
      return data.user;
    },
    retry: false,
  });

  // Query for mentor data
  const {
    data: mentorData,
    isLoading: mentorLoading,
    refetch: refetchMentor,
  } = useQuery({
    queryKey: ["mentor", user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error("User not found");

      const { data, error } = await supabase
        .from("mentors")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Query for timeslots
  const {
    data: timeslots = [],
    isLoading: timeslotsLoading,
    refetch: refetchTimeslots,
  } = useQuery({
    queryKey: ["timeslots", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("timeslots")
        .select("*")
        .eq("mentor_id", user.id)
        .eq("is_recurring", true)
        .order("day_of_week", { ascending: true });

      if (error) throw error;
      return data as Timeslot[];
    },
    enabled: !!user?.id,
  });

  // Query for appointments
  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery({
    queryKey: ["appointments", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];

      const { data, error } = await supabase
        .from("appointments")
        .select(
          `
          id,
          created_at,
          timeslots!inner (
            day_of_week,
            start_time,
            end_time,
            date
          ),
          users!inner (
            email,
            raw_user_meta_data
          )
        `
        )
        .eq("timeslots.mentor_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!user?.id,
  });

  // Set initial profile data
  useEffect(() => {
    if (mentorData) {
      setProfileData({
        name: mentorData.name || "",
        email: mentorData.email || "",
        profile_pic: mentorData.profile_pic,
        date_of_birth: mentorData.date_of_birth,
        gender: mentorData.gender,
        nationality: mentorData.nationality,
        languages: mentorData.languages || [],
        profession: mentorData.profession,
        scholarship: mentorData.scholarship,
        bio: mentorData.bio,
        linkedin: mentorData.linkedin,
        gmail: mentorData.gmail,
        drive_link: mentorData.drive_link,
        country: mentorData.country,
      });
    }
  }, [mentorData]);

  // Redirect if authentication fails
  useEffect(() => {
    if (userError) {
      router.push("/login");
    }
  }, [userError, router]);

  const handleProfileUpdate = async () => {
    if (!user?.id || !profileData) return;

    try {
      const { error } = await supabase
        .from("mentors")
        .update(profileData)
        .eq("user_id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      refetchMentor();
    } catch (error) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", error);
    }
  };

  const handleAddTimeslot = async () => {
    if (
      !user?.id ||
      !newTimeslot.day_of_week ||
      !newTimeslot.start_time ||
      !newTimeslot.end_time
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { error } = await supabase.from("timeslots").insert({
        mentor_id: user.id,
        day_of_week: parseInt(newTimeslot.day_of_week),
        start_time: newTimeslot.start_time,
        end_time: newTimeslot.end_time,
        is_recurring: true,
      });

      if (error) throw error;

      toast.success("Timeslot added successfully!");
      setNewTimeslot({ day_of_week: "", start_time: "", end_time: "" });
      refetchTimeslots();
    } catch (error) {
      toast.error("Failed to add timeslot");
      console.error("Add timeslot error:", error);
    }
  };

  const handleDeleteTimeslot = async (timeslotId: string) => {
    try {
      const { error } = await supabase
        .from("timeslots")
        .delete()
        .eq("id", timeslotId);

      if (error) throw error;

      toast.success("Timeslot deleted successfully!");
      refetchTimeslots();
    } catch (error) {
      toast.error("Failed to delete timeslot");
      console.error("Delete timeslot error:", error);
    }
  };

  const formatTime = (timeString: string) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (userLoading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg">No user found</div>
      </div>
    );

  // Check verification status - use mentors table verified column
  // Wait for mentor data to load before checking verification
  if (mentorLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const isVerified = mentorData?.verified === true;

  if (!isVerified) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <ClockIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <CardTitle className="text-2xl">Verification Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Thank you for your application. Our administrative team is
              currently reviewing your submitted documents and credentials.
            </p>
            <p className="text-gray-600">
              You will receive an email notification once the verification
              process is complete. This typically takes 2-3 business days.
            </p>
            <div className="pt-4">
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="flex w-full items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Mentor Dashboard
            </h1>
            {/* <p className="text-gray-600">Welcome back, {user.email}</p> */}
          </div>
          <div>
            <LogoutButton />
          </div>
        </div>

        {mentorLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-lg">Loading mentor data...</div>
          </div>
        ) : (
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger
                value="profile"
                className="flex items-center space-x-2"
              >
                <UserIcon className="h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger
                value="availability"
                className="flex items-center space-x-2"
              >
                <CalendarIcon className="h-4 w-4" />
                <span>Availability</span>
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profileData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          value={profileData.name}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              name: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profileData.email}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="profession">Profession</Label>
                        <Input
                          id="profession"
                          value={profileData.profession || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              profession: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="scholarship">Scholarship</Label>
                        <Input
                          id="scholarship"
                          value={profileData.scholarship || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              scholarship: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          value={profileData.country || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              country: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input
                          id="linkedin"
                          value={profileData.linkedin || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              linkedin: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio || ""}
                          onChange={(e) =>
                            setProfileData({
                              ...profileData,
                              bio: e.target.value,
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <Button onClick={handleProfileUpdate}>
                      Update Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Availability Tab */}
            <TabsContent value="availability" className="space-y-6">
              {/* Add New Timeslot */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Recurring Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="day">Day of Week</Label>
                      <Select
                        value={newTimeslot.day_of_week}
                        onValueChange={(value) =>
                          setNewTimeslot({ ...newTimeslot, day_of_week: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {dayNames.map((day, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="start_time">Start Time</Label>
                      <Input
                        id="start_time"
                        type="time"
                        value={newTimeslot.start_time}
                        onChange={(e) =>
                          setNewTimeslot({
                            ...newTimeslot,
                            start_time: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="end_time">End Time</Label>
                      <Input
                        id="end_time"
                        type="time"
                        value={newTimeslot.end_time}
                        onChange={(e) =>
                          setNewTimeslot({
                            ...newTimeslot,
                            end_time: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="flex items-end">
                      <Button onClick={handleAddTimeslot} className="w-full">
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Slot
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current Timeslots */}
              <Card>
                <CardHeader>
                  <CardTitle>Your Availability Schedule</CardTitle>
                </CardHeader>
                <CardContent>
                  {timeslotsLoading ? (
                    <div className="text-center py-4">
                      Loading availability...
                    </div>
                  ) : timeslots.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No availability set. Add your first time slot above.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {timeslots.map((slot) => (
                        <div
                          key={slot.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">
                              {dayNames[slot.day_of_week]}
                            </Badge>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <ClockIcon className="h-4 w-4" />
                              <span>
                                {formatTime(slot.start_time)} -{" "}
                                {formatTime(slot.end_time || "")}
                              </span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTimeslot(slot.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Appointments */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  {appointmentsLoading ? (
                    <div className="text-center py-4">
                      Loading appointments...
                    </div>
                  ) : appointments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No appointments yet. Students will be able to book your
                      available time slots.
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map((appointment) => (
                        <div
                          key={appointment.id}
                          className="flex items-center justify-between p-4 border rounded-lg"
                        >
                          <div className="space-y-1">
                            <div className="font-medium">
                              {appointment.users.raw_user_meta_data?.name ||
                                "Student"}
                            </div>
                            <div className="text-sm text-gray-600">
                              {appointment.users.email}
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                              <CalendarIcon className="h-4 w-4" />
                              <span>
                                {dayNames[appointment.timeslots.day_of_week]}{" "}
                                {formatTime(appointment.timeslots.start_time)} -{" "}
                                {formatTime(appointment.timeslots.end_time)}
                              </span>
                            </div>
                          </div>
                          <Badge variant="secondary">
                            {new Date(
                              appointment.created_at
                            ).toLocaleDateString()}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
