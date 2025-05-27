"use client";
import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileData {
  gender: string;
  dateOfBirth: string;
  cgpa: string;
  degreeLevel: string;
  subject: string;
  studyTimeline: string;
  preferredCountries: string[];
  documents: string[];
  motivation: string;
}

const ProfileQuestions = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    gender: "",
    dateOfBirth: "",
    cgpa: "",
    degreeLevel: "",
    subject: "",
    studyTimeline: "",
    preferredCountries: [],
    documents: [],
    motivation: "",
  });
  const router = useRouter();

  const questions = [
    {
      id: "gender",
      title: "What is your gender?",
      type: "radio",
      options: ["Male", "Female", "Other", "Prefer not to say"],
    },
    {
      id: "dateOfBirth",
      title: "What is your date of birth?",
      type: "date",
    },
    {
      id: "cgpa",
      title: "What is your current CGPA (or final GPA/percentage)?",
      description: "Please write accurately — e.g., 3.85/4.00 or 85%",
      type: "text",
    },
    {
      id: "degreeLevel",
      title: "Which level are you applying for?",
      type: "radio",
      options: ["Bachelor's", "Master's", "PhD", "Other"],
    },
    {
      id: "subject",
      title: "What subject or program do you want to study?",
      description: "E.g., Computer Science, Public Health, Economics, etc.",
      type: "text",
    },
    {
      id: "studyTimeline",
      title: "When do you plan to start your studies?",
      type: "radio",
      options: [
        "Within the next 6 months",
        "6–12 months from now",
        "1–2 years from now",
        "Not sure yet",
      ],
    },
    {
      id: "preferredCountries",
      title: "Which countries would you prefer for your scholarship?",
      description: "Select up to 3",
      type: "checkbox",
      options: ["USA", "Canada", "UK", "Germany", "Netherlands", "Other"],
    },
    {
      id: "documents",
      title: "What documents do you already have ready?",
      description: "Select all that apply",
      type: "checkbox",
      options: [
        "Academic Transcript",
        "Degree Certificate",
        "English Test Score (IELTS/TOEFL/Duolingo)",
        "CV/Resume",
        "Statement of Purpose",
        "Recommendation Letters",
        "Passport",
        "Financial Documents",
      ],
    },
    {
      id: "motivation",
      title:
        "Briefly, why do you want this scholarship and what is your long-term goal?",
      description: "1–2 sentences max. Helps us understand your motivation.",
      type: "textarea",
    },
  ];

  const totalSteps = questions.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const handleInputChange = (
    field: keyof ProfileData,
    value: string | string[]
  ) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCheckboxChange = (
    field: keyof ProfileData,
    option: string,
    checked: boolean
  ) => {
    setProfileData((prev) => {
      const currentArray = prev[field] as string[];
      if (checked) {
        // For countries, limit to 3
        if (field === "preferredCountries" && currentArray.length >= 3) {
          return prev;
        }
        return {
          ...prev,
          [field]: [...currentArray, option],
        };
      } else {
        return {
          ...prev,
          [field]: currentArray.filter((item) => item !== option),
        };
      }
    });
  };

  const isStepValid = () => {
    const currentQuestion = questions[currentStep];
    const value = profileData[currentQuestion.id as keyof ProfileData];

    if (currentQuestion.type === "checkbox") {
      return Array.isArray(value) && value.length > 0;
    }
    return value && value.toString().trim() !== "";
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatProfileData = (data: ProfileData): string => {
    const parts = [];

    if (data.gender) parts.push(`gender-${data.gender.toLowerCase()}`);
    if (data.dateOfBirth) parts.push(`date_of_birth-${data.dateOfBirth}`);
    if (data.cgpa) parts.push(`cgpa-${data.cgpa}`);
    if (data.degreeLevel) parts.push(`degree_level-${data.degreeLevel}`);
    if (data.subject) parts.push(`subject-"${data.subject}"`);
    if (data.studyTimeline)
      parts.push(`study_timeline-"${data.studyTimeline}"`);
    if (data.preferredCountries.length > 0) {
      parts.push(`preferred_countries-"${data.preferredCountries.join(", ")}"`);
    }
    if (data.documents.length > 0) {
      parts.push(`available_documents-"${data.documents.join(", ")}"`);
    }
    if (data.motivation) parts.push(`goals-"${data.motivation}"`);

    return parts.join(", ");
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("User not authenticated");
      }

      // Format profile data
      const formattedProfile = formatProfileData(profileData);

      // Check if profile exists, create if not
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user.id)
        .single();

      if (!existingProfile) {
        // Create new profile
        const { error: createError } = await supabase.from("profiles").insert({
          user_id: user.id,
          profile: formattedProfile,
          gender: profileData.gender,
          date_of_birth: profileData.dateOfBirth
            ? new Date(profileData.dateOfBirth).toISOString()
            : null,
        });

        if (createError) {
          throw new Error(createError.message);
        }
      } else {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({
            profile: formattedProfile,
            gender: profileData.gender,
            date_of_birth: profileData.dateOfBirth
              ? new Date(profileData.dateOfBirth).toISOString()
              : null,
          })
          .eq("user_id", user.id);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }

      // Call the scholarship matching API
      const response = await fetch("/api/get_matched_scholarships", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_profile: formattedProfile,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get matched scholarships");
      }

      // Reload the page to show matched scholarships
      window.location.reload();
    } catch (error) {
      console.error("Error submitting profile:", error);
      alert("Failed to submit profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderQuestion = () => {
    const question = questions[currentStep];
    const value = profileData[question.id as keyof ProfileData];

    switch (question.type) {
      case "radio":
        return (
          <RadioGroup
            value={value as string}
            onValueChange={(val) =>
              handleInputChange(question.id as keyof ProfileData, val)
            }
            className="space-y-4"
          >
            {question.options?.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer"
              >
                <RadioGroupItem
                  value={option}
                  id={option}
                  className="text-blue-600"
                />
                <Label
                  htmlFor={option}
                  className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "checkbox":
        return (
          <div className="space-y-4">
            {question.options?.map((option) => (
              <div
                key={option}
                className="flex items-center space-x-3 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200 cursor-pointer"
              >
                <Checkbox
                  id={option}
                  checked={(value as string[])?.includes(option) || false}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange(
                      question.id as keyof ProfileData,
                      option,
                      checked as boolean
                    )
                  }
                  disabled={
                    question.id === "preferredCountries" &&
                    !(value as string[])?.includes(option) &&
                    (value as string[])?.length >= 3
                  }
                  className="text-blue-600"
                />
                <Label
                  htmlFor={option}
                  className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 flex-1"
                >
                  {option}
                </Label>
              </div>
            ))}
            {question.id === "preferredCountries" && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                  Selected: {(value as string[])?.length || 0}/3 countries
                </p>
              </div>
            )}
          </div>
        );

      case "date":
        return (
          <Input
            type="date"
            value={value as string}
            onChange={(e) =>
              handleInputChange(
                question.id as keyof ProfileData,
                e.target.value
              )
            }
            className="max-w-md h-12 text-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        );

      case "textarea":
        return (
          <Textarea
            value={value as string}
            onChange={(e) =>
              handleInputChange(
                question.id as keyof ProfileData,
                e.target.value
              )
            }
            placeholder="Share your motivation and goals..."
            className="min-h-[120px] text-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg resize-none"
          />
        );

      default:
        return (
          <Input
            type="text"
            value={value as string}
            onChange={(e) =>
              handleInputChange(
                question.id as keyof ProfileData,
                e.target.value
              )
            }
            placeholder="Type your answer here..."
            className="max-w-md h-12 text-lg border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mb-4">
            <Sparkles className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
            Complete Your Profile
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Help us find the perfect scholarships tailored just for you
          </p>
        </div>

        {/* Progress Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of {totalSteps}
            </span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress
            value={progress}
            className="h-3 bg-gray-200 dark:bg-gray-700"
          />
        </div>

        {/* Question Card */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 hover:shadow-2xl">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl font-semibold leading-tight text-gray-900 dark:text-white">
              {questions[currentStep].title}
            </CardTitle>
            {questions[currentStep].description && (
              <CardDescription className="text-base text-gray-600 dark:text-gray-300 mt-2">
                {questions[currentStep].description}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-6">{renderQuestion()}</div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="flex items-center gap-2 px-6 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          {currentStep === totalSteps - 1 ? (
            <Button
              onClick={handleSubmit}
              disabled={!isStepValid() || isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Finding Scholarships...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Complete Profile
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileQuestions;
