"use client";

import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MultiSelect from "@/components/multi-select";

// Language options for the MultiSelect
const languageOptions = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "italian", label: "Italian" },
  { value: "portuguese", label: "Portuguese" },
  { value: "chinese", label: "Chinese" },
  { value: "japanese", label: "Japanese" },
  { value: "korean", label: "Korean" },
  { value: "arabic", label: "Arabic" },
  { value: "hindi", label: "Hindi" },
  { value: "russian", label: "Russian" },
];

export function MentorSignUpForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [nationality, setNationality] = useState("");
  const [languages, setLanguages] = useState<string[]>([]);
  const [profession, setProfession] = useState("");
  const [scholarship, setScholarship] = useState("");
  const [bio, setBio] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [gmail, setGmail] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleMentorSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const supabase = createClient();
    setIsLoading(true);
    setError(null);
    try {
      const {
        data: { user },
        error: signUpError,
      } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/mentor`,
          data: {
            full_name: fullName,
            role: "mentor",
            status: "active",
            profile_picture_url: "",
          },
        },
      });

      if (signUpError) throw signUpError;
      console.log(user);

      if (user) {
        const { error: mentorError } = await supabase.from("mentors").insert([
          {
            user_id: user.id,
            name: fullName,
            email: email,
            date_of_birth: dateOfBirth,
            gender,
            nationality,
            languages,
            profession,
            scholarship,
            bio,
            linkedin,
            gmail,
            drive_link: driveLink,
            country,
          },
        ]);

        if (mentorError) throw mentorError;
      }

      router.push("/mentor");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn("flex flex-col gap-6 items-center", className)}
      {...props}
    >
      <Card className="w-full lg:w-[900px]">
        <CardHeader>
          <CardTitle className="text-2xl">Mentor Registration</CardTitle>
          <CardDescription>Create a new mentor account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleMentorSignUp}>
            <div className="grid lg:grid-cols-2 lg:border border-gray-200 rounded-lg lg:p-6 mb-6">
              {/* First Column */}
              <div className="flex flex-col gap-6 lg:border-r lg:border-gray-200 lg:p-6 lg:pe-10">
                <div className="grid gap-2">
                  <Label htmlFor="full-name">Full Name</Label>
                  <Input
                    id="full-name"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="grid gap-2 w-full">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="prefer-not-to-say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date-of-birth">Date of Birth</Label>
                    <Input
                      id="date-of-birth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="nationality">Nationality</Label>
                  <Input
                    id="nationality"
                    type="text"
                    placeholder="e.g., Bangladeshi"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="country">Where do you live?</Label>
                  <Input
                    id="country"
                    type="text"
                    placeholder="e.g., United States, United Kingdom"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="languages">
                    What languages do you speak?
                  </Label>
                  <MultiSelect
                    id="languages"
                    value={languages}
                    onChange={setLanguages}
                    options={languageOptions}
                    placeholder="Select languages you speak"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-6 lg:p-6 lg:ps-10">
                <div className="grid gap-2">
                  <Label htmlFor="profession">What do you do?</Label>
                  <Input
                    id="profession"
                    type="text"
                    placeholder="e.g., PhD at Stanford"
                    value={profession}
                    onChange={(e) => setProfession(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="scholarship">
                    What scholarships have you received?
                  </Label>
                  <Input
                    id="scholarship"
                    type="text"
                    placeholder="e.g., 70% scholarship at Harvard"
                    value={scholarship}
                    onChange={(e) => setScholarship(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell us about yourself, your experience, and how you can help students..."
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="linkedin">LinkedIn Profile</Label>
                  <Input
                    id="linkedin"
                    type="url"
                    placeholder="https://linkedin.com/in/yourprofile"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="gmail">Gmail</Label>
                  <Input
                    id="gmail"
                    type="email"
                    placeholder="your.email@gmail.com"
                    value={gmail}
                    onChange={(e) => setGmail(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="drive-link">
                    Link to your Google Drive Folder containing your documents
                  </Label>
                  <Input
                    id="drive-link"
                    type="url"
                    placeholder="https://drive.google.com/..."
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {error && <p className="text-sm text-red-500">{error}</p>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating an account..." : "Become a Mentor"}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline underline-offset-4">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
