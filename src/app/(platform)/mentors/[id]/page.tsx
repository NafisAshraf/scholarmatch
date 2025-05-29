"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Globe,
  Mail,
  Linkedin,
  Calendar,
  Clock,
  MessageSquare,
  Heart,
  MoreHorizontal,
  ChevronRight,
  Award,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";

// Mock data for mentors
const mentorsData = [
  {
    id: 1,
    fullName: "Diana Kyryliuk",
    profilePicture: "/1.webp",
    scholarship: "75% Scholarship at MIT",
    expertise: ["Scholarship Applications", "SOP Writing", "Interview Prep"],
    bio: "PhD student at MIT with extensive experience in securing scholarships. Successfully obtained multiple grants and awards. Passionate about helping students navigate the scholarship application process.",
    profession: "PhD Student at MIT",
    experience: "3 years",
    credentials: [
      "Full Bright Scholar",
      "NSF Graduate Fellowship",
      "MIT Presidential Fellowship",
    ],
    linkedin: "https://linkedin.com/in/dianakyryliuk",
    gmail: "diana.kyryliuk@mit.edu",
    languages: ["English", "Spanish", "Ukrainian"],
    rating: 4.9,
    location: "US",
    sessions: 63,
    completedSessions: 3,
    available_sessions: [
      { day: "Monday", slot: "9:30am", booked: false },
      { day: "Monday", slot: "2:00pm", booked: true },
      { day: "Wednesday", slot: "11:00am", booked: false },
    ],
    reviews: [
      {
        reviewer: "Maria Lopez",
        rating: 5,
        comment: "Diana helped me secure a 50% scholarship at Columbia!",
        date: "2024-04-10",
      },
      {
        reviewer: "Alex Smith",
        rating: 5,
        comment: "Great guidance on scholarship essays.",
        date: "2024-03-22",
      },
    ],
  },
  {
    id: 2,
    fullName: "Jonathan Stevens",
    profilePicture: "/2.webp",
    scholarship: "100% Scholarship at Stanford",
    expertise: ["Research Proposals", "Grant Writing", "Academic Planning"],
    bio: "PhD candidate at Stanford University, specializing in Computer Science. Recipient of multiple prestigious scholarships and research grants. Dedicated to mentoring students in their academic journey.",
    profession: "PhD Candidate at Stanford University",
    experience: "4 years",
    credentials: [
      "Stanford Graduate Fellowship",
      "Google PhD Fellowship",
      "Microsoft Research Grant",
    ],
    linkedin: "https://linkedin.com/in/jonathanstevens",
    gmail: "jonathan.stevens@stanford.edu",
    languages: ["English", "French"],
    rating: 4.7,
    location: "US",
    sessions: 45,
    completedSessions: 3,
    available_sessions: [
      { day: "Tuesday", slot: "10:00am", booked: false },
      { day: "Thursday", slot: "3:00pm", booked: false },
      { day: "Friday", slot: "1:00pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "Sophie Tremblay",
        rating: 5,
        comment: "Jonathan's advice on research proposals was invaluable.",
        date: "2024-05-01",
      },
      {
        reviewer: "Michael Brown",
        rating: 4,
        comment: "Very knowledgeable about fellowship applications.",
        date: "2024-04-15",
      },
    ],
  },
  {
    id: 3,
    fullName: "Satyajit Roy",
    profilePicture: "/3.webp",
    scholarship: "80% Scholarship at Oxford",
    expertise: [
      "International Scholarships",
      "Research Funding",
      "Academic Writing",
    ],
    bio: "DPhil student at Oxford University with extensive experience in international scholarship applications. Helped over 50 students secure funding for their studies.",
    profession: "DPhil Student at Oxford University",
    experience: "5 years",
    credentials: [
      "Rhodes Scholar",
      "Commonwealth Scholarship",
      "Oxford Merit Award",
    ],
    linkedin: "https://linkedin.com/in/satyajitroy",
    gmail: "satyajit.roy@oxford.ac.uk",
    languages: ["English", "Hindi", "Bengali"],
    rating: 5.0,
    location: "UK",
    sessions: 89,
    completedSessions: 5,
    available_sessions: [
      { day: "Wednesday", slot: "4:00pm", booked: false },
      { day: "Friday", slot: "10:30am", booked: false },
      { day: "Friday", slot: "2:00pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "Priya Sharma",
        rating: 5,
        comment: "Got into Cambridge with full funding thanks to Satyajit!",
        date: "2024-04-28",
      },
      {
        reviewer: "Rahul Das",
        rating: 5,
        comment: "Excellent guidance on scholarship essays.",
        date: "2024-03-30",
      },
    ],
  },
  {
    id: 4,
    fullName: "Bernie Chiu",
    profilePicture: "/4.webp",
    scholarship: "90% Scholarship at Berkeley",
    expertise: ["STEM Scholarships", "Research Proposals", "Technical Writing"],
    bio: "PhD researcher at UC Berkeley specializing in Computer Science. Successfully secured multiple STEM scholarships and research grants. Passionate about helping students in technical fields.",
    profession: "PhD Researcher at UC Berkeley",
    experience: "3 years",
    credentials: ["Berkeley Fellowship", "NSF GRFP", "Intel PhD Fellowship"],
    linkedin: "https://linkedin.com/in/berniechiu",
    gmail: "bernie.chiu@berkeley.edu",
    languages: ["English", "Mandarin", "Cantonese"],
    rating: 4.8,
    location: "US",
    sessions: 34,
    completedSessions: 2,
    available_sessions: [
      { day: "Monday", slot: "8:00am", booked: false },
      { day: "Thursday", slot: "5:00pm", booked: true },
      { day: "Friday", slot: "9:00am", booked: false },
    ],
    reviews: [
      {
        reviewer: "Wei Lin",
        rating: 5,
        comment: "Bernie helped me get the Intel scholarship!",
        date: "2024-04-18",
      },
      {
        reviewer: "Emily Wong",
        rating: 4,
        comment: "Great advice on STEM research proposals.",
        date: "2024-03-25",
      },
    ],
  },
  {
    id: 5,
    fullName: "Tau Jin",
    profilePicture: "/5.webp",
    scholarship: "100% Scholarship at Stanford",
    expertise: ["AI/ML Scholarships", "Research Grants", "Technical Writing"],
    bio: "PhD student at Stanford focusing on AI/ML. Recipient of multiple tech industry fellowships and research grants. Passionate about helping students secure funding in tech fields.",
    profession: "PhD Student at Stanford University",
    experience: "2 years",
    credentials: [
      "Stanford AI Lab Fellowship",
      "OpenAI Scholarship",
      "Google PhD Fellowship",
    ],
    linkedin: "https://linkedin.com/in/taujin",
    gmail: "tau.jin@stanford.edu",
    languages: ["English", "Mandarin"],
    rating: 4.6,
    location: "US",
    sessions: 12,
    completedSessions: 1,
    available_sessions: [
      { day: "Tuesday", slot: "11:00am", booked: false },
      { day: "Thursday", slot: "1:30pm", booked: true },
      { day: "Friday", slot: "3:00pm", booked: false },
    ],
    reviews: [
      {
        reviewer: "Kevin Lee",
        rating: 5,
        comment: "Tau helped me secure an AI research grant.",
        date: "2024-05-02",
      },
      {
        reviewer: "Anna Kim",
        rating: 4,
        comment: "Excellent guidance on fellowship applications.",
        date: "2024-04-12",
      },
    ],
  },
  {
    id: 6,
    fullName: "Javier Ruiz Salvador",
    profilePicture: "/6.webp",
    scholarship: "70% Scholarship at LSE",
    expertise: [
      "European Scholarships",
      "Research Funding",
      "Academic Writing",
    ],
    bio: "PhD candidate at London School of Economics with expertise in European scholarship programs. Experienced in helping students navigate international funding opportunities.",
    profession: "PhD Candidate at LSE",
    experience: "4 years",
    credentials: [
      "Erasmus Mundus Scholar",
      "LSE PhD Scholarship",
      "EU Research Grant",
    ],
    linkedin: "https://linkedin.com/in/javierruizsalvador",
    gmail: "j.r.salvador@lse.ac.uk",
    languages: ["English", "Spanish", "Portuguese"],
    rating: 4.9,
    location: "UK",
    sessions: 156,
    completedSessions: 8,
    available_sessions: [
      { day: "Monday", slot: "10:00am", booked: false },
      { day: "Wednesday", slot: "2:00pm", booked: false },
      { day: "Thursday", slot: "4:00pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "Carlos Mendes",
        rating: 5,
        comment: "Secured Erasmus funding with Javier's help!",
        date: "2024-04-20",
      },
      {
        reviewer: "Lucia Garcia",
        rating: 5,
        comment: "Great mentor for European scholarships.",
        date: "2024-03-29",
      },
    ],
  },
  {
    id: 7,
    fullName: "Sarah Chen",
    profilePicture: "/7.webp",
    scholarship: "85% Scholarship at Harvard",
    expertise: [
      "Data Science Scholarships",
      "Research Grants",
      "Technical Writing",
    ],
    bio: "PhD student at Harvard specializing in Data Science. Successfully secured multiple scholarships and research grants. Passionate about helping students in quantitative fields.",
    profession: "PhD Student at Harvard University",
    experience: "3 years",
    credentials: [
      "Harvard Merit Fellowship",
      "NSF Graduate Fellowship",
      "Bloomberg Data Science PhD Grant",
    ],
    linkedin: "https://linkedin.com/in/sarahchen",
    gmail: "sarah.chen@harvard.edu",
    languages: ["English", "Mandarin", "Korean"],
    rating: 4.8,
    location: "US",
    sessions: 67,
    completedSessions: 4,
    available_sessions: [
      { day: "Tuesday", slot: "9:00am", booked: false },
      { day: "Thursday", slot: "11:00am", booked: false },
      { day: "Friday", slot: "2:30pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "David Park",
        rating: 5,
        comment: "Sarah's guidance helped me get NSF funding!",
        date: "2024-04-25",
      },
      {
        reviewer: "Mina Lee",
        rating: 5,
        comment: "Excellent mentor for data science scholarships.",
        date: "2024-03-31",
      },
    ],
  },
];

const expertiseOptions = [
  "Scholarship Applications",
  "SOP Writing",
  "Interview Prep",
  "Research Proposals",
  "Grant Writing",
  "Academic Planning",
  "Technical Writing",
  "International Scholarships",
  "STEM Scholarships",
  "European Scholarships",
  "Data Science Scholarships",
];

const locationOptions = ["US", "CA", "ES", "IN", "TW", "UK", "DE", "FR"];

interface Mentor {
  id: number;
  fullName: string;
  profilePicture: string;
  scholarship: string;
  expertise: string[];
  bio: string;
  profession: string;
  experience: string;
  credentials: string[];
  linkedin: string;
  gmail: string;
  languages: string[];
  rating: number;
  location: string;
  sessions: number;
  completedSessions: number;
  available_sessions: {
    day: string;
    slot: string;
    booked: boolean;
  }[];
  reviews: {
    reviewer: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export default function MentorPage() {
  const params = useParams();
  const [mentor, setMentor] = useState<Mentor | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  useEffect(() => {
    const foundMentor = mentorsData.find(
      (mentor) => mentor.id === Number(params.id)
    );
    if (foundMentor) {
      setMentor(foundMentor);
    }
  }, [params.id]);

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading mentor profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Section */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <div className="relative">
                      <Avatar className="h-20 w-20">
                        <AvatarImage
                          src={mentor.profilePicture}
                          alt={mentor.fullName}
                          className="object-cover"
                        />
                        <AvatarFallback className="text-lg">
                          {mentor.fullName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h1 className="text-2xl font-bold text-gray-900">
                          {mentor.fullName}
                        </h1>
                        <Badge
                          variant="secondary"
                          className="bg-orange-100 text-orange-800 border-orange-200"
                        >
                          {mentor.location}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mt-1">{mentor.profession}</p>
                      <Badge
                        variant="secondary"
                        className=" bg-green-100 text-green-800 text-xs whitespace-nowrap"
                      >
                        {mentor.scholarship}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>Report</DropdownMenuItem>
                        <DropdownMenuItem>Block</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Navigation Tabs */}
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 bg-white border rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-cyan-50 data-[state=active]:text-cyan-700"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6">
                {/* Main Bio Section */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <p className="text-gray-700 leading-relaxed">
                        {mentor.bio}
                      </p>

                      <div className="flex items-center space-x-4 pt-4 border-t">
                        <Button variant="outline" size="sm" asChild>
                          <a
                            href={mentor.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin className="h-4 w-4 mr-2" />
                            LinkedIn
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" asChild>
                          <a href={`mailto:${mentor.gmail}`}>
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Background Section */}
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Background
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Expertise</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.expertise.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-blue-50 text-blue-700"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Languages</p>
                        <div className="flex flex-wrap gap-2">
                          {mentor.languages.map((language, index) => (
                            <Badge key={index} variant="outline">
                              {language}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">Experience</p>
                        <p className="text-gray-900 font-medium">
                          {mentor.experience}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews" className="mt-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Reviews
                      </h3>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= Math.floor(mentor.rating)
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {mentor.rating}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      {mentor.reviews.map((review, index) => (
                        <div
                          key={index}
                          className="border-b border-gray-100 pb-4 last:border-b-0"
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="text-sm font-medium text-gray-900">
                              {review.reviewer}
                            </span>
                            <span className="text-sm text-gray-400">
                              {review.date}
                            </span>
                          </div>
                          <p className="text-gray-700">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="achievements" className="mt-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Achievements
                    </h3>
                    <div className="space-y-3">
                      {mentor.credentials.map((credential, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                        >
                          <Award className="h-5 w-5 text-blue-600" />
                          <span className="text-gray-700">{credential}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="group-sessions" className="mt-6">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Group Sessions
                    </h3>
                    <p className="text-gray-600">
                      No group sessions available at this time.
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Community Statistics */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Community statistics
                  </h3>
                  {/* <Button variant="ghost" size="sm" className="text-blue-600">
                    See more
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button> */}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Star className="h-5 w-5 text-yellow-600 Smr-2" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {mentor.rating}
                    </div>
                    <div className="text-sm text-gray-600">Mentor rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Users className="h-5 w-5 text-pink-600 mr-2" />
                    </div>
                    <div className="text-2xl font-bold text-gray-900">
                      {mentor.completedSessions}
                    </div>
                    <div className="text-sm text-gray-600">
                      Sessions completed
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-6 text-center">
                <div className="text-sm text-gray-600 mb-2">Charge</div>
                <div className="text-3xl  text-gray-900">$10/hr</div>
              </CardContent>
            </Card>

            {/* Available Sessions */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Available sessions
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Book 1:1 sessions from the options based on your needs
                </p>

                {/* Available Session Times */}
                <div className="space-y-2 mb-6">
                  {mentor.available_sessions.map((session, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        session.booked
                          ? "bg-gray-50 border-gray-200 text-gray-400"
                          : "bg-white border-blue-200 hover:bg-blue-50 cursor-pointer"
                      }`}
                      onClick={() =>
                        !session.booked &&
                        setSelectedTimeSlot(`${session.day} ${session.slot}`)
                      }
                    >
                      <div>
                        <div className="font-medium">{session.day}</div>
                        <div className="text-sm text-gray-600">
                          {session.slot}
                        </div>
                      </div>
                      <div className="text-sm">
                        {session.booked ? (
                          <Badge
                            variant="secondary"
                            className="bg-red-100 text-red-800"
                          >
                            Booked
                          </Badge>
                        ) : (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            Available
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                  disabled={!selectedTimeSlot}
                >
                  {selectedTimeSlot
                    ? `Book ${selectedTimeSlot}`
                    : "Select a time slot"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
