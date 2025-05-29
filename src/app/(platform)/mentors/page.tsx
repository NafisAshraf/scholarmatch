"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Star,
  MapPin,
  Globe,
  Mail,
  Linkedin,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

// Mock data for mentors
const mentorsData = [
  {
    id: 1,
    fullName: "Diana Kyryliuk",
    profilePicture: "/1.webp",
    expertise: ["UX/UI Design", "Product Design", "Design Systems"],
    bio: "Experienced UX/UI Designer with over 13 years in the industry. Passionate about creating user-centered designs and mentoring the next generation of designers. Currently leading design initiatives at United Nations (UNICC).",
    profession: "Lead UX/UI Designer at United Nations (UNICC)",
    experience: "13 years",
    credentials: [
      "Master's in Design",
      "Google UX Certificate",
      "Adobe Certified Expert",
    ],
    linkedin: "https://linkedin.com/in/dianakyryliuk",
    gmail: "diana.kyryliuk@gmail.com",
    languages: ["English", "Spanish", "Ukrainian"],
    rating: 4.9,
    location: "ES",
    sessions: 63,
    available_sessions: [
      { day: "Monday", slot: "9:30am", booked: false },
      { day: "Monday", slot: "2:00pm", booked: true },
      { day: "Wednesday", slot: "11:00am", booked: false },
    ],
    reviews: [
      {
        reviewer: "Maria Lopez",
        rating: 5,
        comment:
          "Diana is an amazing mentor! She helped me improve my portfolio.",
        date: "2024-04-10",
      },
      {
        reviewer: "Alex Smith",
        rating: 5,
        comment: "Very insightful and supportive.",
        date: "2024-03-22",
      },
    ],
  },
  {
    id: 2,
    fullName: "Jonathan Stevens",
    profilePicture: "/2.webp",
    expertise: [
      "Technical Leadership",
      "Software Architecture",
      "Team Management",
    ],
    bio: "Senior Technical Lead with 15 years of experience in fintech. Expert in building scalable systems and leading high-performing engineering teams. Passionate about mentoring developers and sharing knowledge.",
    profession: "Senior Technical Lead at Scotiabank",
    experience: "15 years",
    credentials: [
      "Computer Science Degree",
      "AWS Solutions Architect",
      "Scrum Master Certified",
    ],
    linkedin: "https://linkedin.com/in/jonathanstevens",
    gmail: "jonathan.stevens@gmail.com",
    languages: ["English", "French"],
    rating: 4.7,
    location: "CA",
    sessions: 45,
    available_sessions: [
      { day: "Tuesday", slot: "10:00am", booked: false },
      { day: "Thursday", slot: "3:00pm", booked: false },
      { day: "Friday", slot: "1:00pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "Sophie Tremblay",
        rating: 5,
        comment: "Jonathan provided great advice on system architecture.",
        date: "2024-05-01",
      },
      {
        reviewer: "Michael Brown",
        rating: 4,
        comment: "Very knowledgeable and helpful.",
        date: "2024-04-15",
      },
    ],
  },
  {
    id: 3,
    fullName: "Satyajit Roy",
    profilePicture: "/3.webp",
    expertise: ["Product Design", "Design Strategy", "User Research"],
    bio: "Design Head with 18 years of experience in creating innovative digital products. Led design teams at multiple startups and established companies. Expert in design thinking and user-centered design methodologies.",
    profession: "Design Head at OMind Technologies",
    experience: "18 years",
    credentials: [
      "Design Management Certificate",
      "Stanford Design Thinking",
      "IDEO Design Kit",
    ],
    linkedin: "https://linkedin.com/in/satyajitroy",
    gmail: "satyajit.roy@gmail.com",
    languages: ["English", "Hindi", "Bengali"],
    rating: 5.0,
    location: "IN",
    sessions: 89,
    available_sessions: [
      { day: "Wednesday", slot: "4:00pm", booked: false },
      { day: "Friday", slot: "10:30am", booked: false },
      { day: "Friday", slot: "2:00pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "Priya Sharma",
        rating: 5,
        comment: "Satyajit is a fantastic mentor for product design.",
        date: "2024-04-28",
      },
      {
        reviewer: "Rahul Das",
        rating: 5,
        comment: "Great insights on user research.",
        date: "2024-03-30",
      },
    ],
  },
  {
    id: 4,
    fullName: "Bernie Chiu",
    profilePicture: "/4.webp",
    expertise: ["E-commerce", "Engineering Management", "Startup Growth"],
    bio: "Engineering professional with 10 years of experience in e-commerce and startup environments. Currently working at Rivo Commerce, focusing on scalable engineering solutions and team leadership.",
    profession: "Engineering at Rivo Commerce",
    experience: "10 years",
    credentials: [
      "Engineering Degree",
      "PMP Certification",
      "Agile Practitioner",
    ],
    linkedin: "https://linkedin.com/in/berniechiu",
    gmail: "bernie.chiu@gmail.com",
    languages: ["English", "Mandarin", "Cantonese"],
    rating: 4.8,
    location: "TW",
    sessions: 34,
    available_sessions: [
      { day: "Monday", slot: "8:00am", booked: false },
      { day: "Thursday", slot: "5:00pm", booked: true },
      { day: "Friday", slot: "9:00am", booked: false },
    ],
    reviews: [
      {
        reviewer: "Wei Lin",
        rating: 5,
        comment: "Bernie helped me understand startup growth strategies.",
        date: "2024-04-18",
      },
      {
        reviewer: "Emily Wong",
        rating: 4,
        comment: "Very practical advice for e-commerce.",
        date: "2024-03-25",
      },
    ],
  },
  {
    id: 5,
    fullName: "Tau Jin",
    profilePicture: "/5.webp",
    expertise: ["AI/ML", "Technical Strategy", "Product Development"],
    bio: "Member of Technical Staff with 5 years of experience in AI and machine learning. Currently working at Harvey AI, Airbnb, and Stanford. Passionate about cutting-edge technology and mentoring aspiring technologists.",
    profession: "Member of Technical Staff at Harvey AI, Airbnb, Stanford",
    experience: "5 years",
    credentials: [
      "PhD in Computer Science",
      "Stanford AI Certificate",
      "Google ML Engineer",
    ],
    linkedin: "https://linkedin.com/in/taujin",
    gmail: "tau.jin@gmail.com",
    languages: ["English", "Mandarin"],
    rating: 4.6,
    location: "US",
    sessions: 12,
    available_sessions: [
      { day: "Tuesday", slot: "11:00am", booked: false },
      { day: "Thursday", slot: "1:30pm", booked: true },
      { day: "Friday", slot: "3:00pm", booked: false },
    ],
    reviews: [
      {
        reviewer: "Kevin Lee",
        rating: 5,
        comment: "Tau is very knowledgeable in AI/ML.",
        date: "2024-05-02",
      },
      {
        reviewer: "Anna Kim",
        rating: 4,
        comment: "Great mentor for technical strategy.",
        date: "2024-04-12",
      },
    ],
  },
  {
    id: 6,
    fullName: "Javier Ruiz Salvador",
    profilePicture: "/6.webp",
    expertise: ["Product Management", "SaaS", "B2B Strategy"],
    bio: "Staff Product Manager with 13 years of experience in product leadership and strategy. Expert in B2B SaaS products, product-led growth, and cross-functional team leadership. Passionate about building products that solve real problems.",
    profession:
      "Staff Product Manager | Product Leader | Trainer | SaaS | B2B | B2C",
    experience: "13 years",
    credentials: [
      "MBA",
      "Product Management Certificate",
      "Lean Six Sigma Black Belt",
    ],
    linkedin: "https://linkedin.com/in/javierruizsalvador",
    gmail: "javier.ruiz@gmail.com",
    languages: ["English", "Spanish", "Portuguese"],
    rating: 4.9,
    location: "ES",
    sessions: 156,
    available_sessions: [
      { day: "Monday", slot: "10:00am", booked: false },
      { day: "Wednesday", slot: "2:00pm", booked: false },
      { day: "Thursday", slot: "4:00pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "Carlos Mendes",
        rating: 5,
        comment: "Javier is an expert in SaaS and product management.",
        date: "2024-04-20",
      },
      {
        reviewer: "Lucia Garcia",
        rating: 5,
        comment: "Very helpful and insightful mentor.",
        date: "2024-03-29",
      },
    ],
  },
  {
    id: 7,
    fullName: "Sarah Chen",
    profilePicture: "/7.webp",
    expertise: ["Data Science", "Machine Learning", "Analytics"],
    bio: "Senior Data Scientist with expertise in machine learning, statistical analysis, and data visualization. Experienced in building data-driven products and leading analytics teams in tech companies.",
    profession: "Senior Data Scientist at Meta",
    experience: "8 years",
    credentials: [
      "PhD in Statistics",
      "Google Analytics Certified",
      "Tableau Expert",
    ],
    linkedin: "https://linkedin.com/in/sarahchen",
    gmail: "sarah.chen@gmail.com",
    languages: ["English", "Mandarin", "Korean"],
    rating: 4.8,
    location: "US",
    sessions: 67,
    available_sessions: [
      { day: "Tuesday", slot: "9:00am", booked: false },
      { day: "Thursday", slot: "11:00am", booked: false },
      { day: "Friday", slot: "2:30pm", booked: true },
    ],
    reviews: [
      {
        reviewer: "David Park",
        rating: 5,
        comment: "Sarah is a fantastic data science mentor.",
        date: "2024-04-25",
      },
      {
        reviewer: "Mina Lee",
        rating: 5,
        comment: "Helped me a lot with machine learning concepts.",
        date: "2024-03-31",
      },
    ],
  },
];

const expertiseOptions = [
  "UX/UI Design",
  "Product Design",
  "Technical Leadership",
  "Software Architecture",
  "Product Management",
  "Data Science",
  "Machine Learning",
  "E-commerce",
  "AI/ML",
  "SaaS",
  "Design Strategy",
];

const locationOptions = ["US", "CA", "ES", "IN", "TW", "UK", "DE", "FR"];

export default function MentorsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpertise, setSelectedExpertise] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [selectedRating, setSelectedRating] = useState<string>("");

  const filteredMentors = useMemo(() => {
    return mentorsData.filter((mentor) => {
      const matchesSearch =
        mentor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        mentor.expertise.some((exp) =>
          exp.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesExpertise =
        !selectedExpertise ||
        mentor.expertise.some((exp) => exp.includes(selectedExpertise));

      const matchesLocation =
        !selectedLocation || mentor.location === selectedLocation;

      const matchesRating =
        !selectedRating ||
        (selectedRating === "4+" && mentor.rating >= 4) ||
        (selectedRating === "4.5+" && mentor.rating >= 4.5) ||
        (selectedRating === "4.8+" && mentor.rating >= 4.8);

      return (
        matchesSearch && matchesExpertise && matchesLocation && matchesRating
      );
    });
  }, [searchTerm, selectedExpertise, selectedLocation, selectedRating]);

  const clearFilters = () => {
    setSelectedExpertise("");
    setSelectedLocation("");
    setSelectedRating("");
  };

  return (
    <div className="min-h-screen bg-gradient">
      <div className="container max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-bold text-gradient mb-2">Mentors</h1>
          <p className="text-muted-foreground text-lg">
            Connect with experienced mentors and receive personalized guidance
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative bg-background">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search mentors by name, profession, or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Expertise
                  {selectedExpertise && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedExpertise}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Select Expertise</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {expertiseOptions.map((expertise) => (
                  <DropdownMenuItem
                    key={expertise}
                    onClick={() => setSelectedExpertise(expertise)}
                  >
                    {expertise}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Location
                  {selectedLocation && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedLocation}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Select Location</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {locationOptions.map((location) => (
                  <DropdownMenuItem
                    key={location}
                    onClick={() => setSelectedLocation(location)}
                  >
                    {location}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Star className="h-4 w-4" />
                  Rating
                  {selectedRating && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedRating}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Minimum Rating</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSelectedRating("4+")}>
                  4+ Stars
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRating("4.5+")}>
                  4.5+ Stars
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedRating("4.8+")}>
                  4.8+ Stars
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {(selectedExpertise || selectedLocation || selectedRating) && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="text-muted-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredMentors.length} mentor
            {filteredMentors.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Mentors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMentors.map((mentor) => (
            <Card
              key={mentor.id}
              className="hover:shadow-lg transition-shadow duration-300 bg-background backdrop-blur-sm border-border/50"
            >
              <CardContent className="p-6 flex flex-col h-full">
                {/* Header with Avatar and Availability */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-20 w-20">
                      <AvatarImage
                        src={mentor.profilePicture}
                        alt={mentor.fullName}
                        className="object-cover"
                      />
                      <AvatarFallback>
                        {mentor.fullName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {mentor.fullName}
                      </h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {mentor.location}
                      </p>
                    </div>
                  </div>
                  {/* <Badge
                   
                  </Badge> */}
                </div>

                {/* Profession */}
                <p className="text-sm font-medium text-foreground mb-3 line-clamp-2">
                  {mentor.profession}
                </p>

                {/* Experience and Rating */}
                <div className="flex items-center justify-between mb-4">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium">Experience:</span>{" "}
                    {mentor.experience}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mentor.rating}</span>
                    <span className="text-muted-foreground text-sm">
                      ({mentor.reviews.length} reviews)
                    </span>
                  </div>
                </div>

                {/* Expertise Tags */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {mentor.expertise.slice(0, 3).map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {mentor.expertise.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{mentor.expertise.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Globe className="h-4 w-4" />
                    <span>{mentor.languages.join(", ")}</span>
                  </div>
                </div>

                {/* Sessions */}
                <div className="mb-4 text-sm text-muted-foreground">
                  <span className="font-medium">
                    {mentor.sessions} sessions
                  </span>{" "}
                  completed
                </div>

                {/* Contact Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/mentors/${mentor.id}`}
                    className="flex-1 w-full"
                  >
                    <Button className="flex-1 w-full bg-button text-primary-foreground hover:opacity-90">
                      Book Session
                    </Button>
                  </Link>
                  <Button variant="outline" size="icon" asChild>
                    <a
                      href={mentor.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:${mentor.gmail}`}>
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredMentors.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No mentors found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
