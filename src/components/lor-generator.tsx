import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Sparkles } from "lucide-react";

const LorGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      toast.error("Missing Information", {
        description:
          "Please provide details about the student and their achievements.",
      });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate_lor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: "Write a Letter of Recommendation for my student.",
          student_profile: prompt,
        }),
      });
      if (!response.ok) throw new Error("Failed to generate LOR");
      const data = await response.json();
      setGeneratedContent(data.lor || "");
      setIsGenerating(false);
      toast.success("Content Generated", {
        description: "Your LOR draft has been generated.",
      });
    } catch (error) {
      setIsGenerating(false);
      toast.error("Error", {
        description: "Failed to generate content. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white via-blue-50 to-gray-100 py-12">
      <div className="text-gradient text-4xl font-bold py-6">
        {" "}
        Letter of Recommendation{" "}
      </div>
      <Card className="w-full max-w-3xl flex flex-col justify-center">
        {/* <CardHeader>
          <CardTitle>Letter of Recommendation Generator</CardTitle>
          <CardDescription>
            Enter details about the student and their achievements to generate a
            personalized LOR.
          </CardDescription>
        </CardHeader> */}
        <CardContent className="flex-1 flex flex-col justify-center">
          <form onSubmit={handleGenerateContent} className="space-y-8">
            <div className="space-y-2">
              <Label htmlFor="prompt">Student Details & Achievements</Label>
              <Textarea
                id="prompt"
                placeholder="E.g., The student is applying for graduate studies in Computer Science. They have a 3.9 GPA, led the robotics club, and completed a research project on AI..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={12}
                required
                className="min-h-[180px]"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isGenerating}
              variant="gradient"
            >
              {isGenerating ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-b-transparent rounded-full"></div>
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate LOR
                </>
              )}
            </Button>
            <div className="space-y-2">
              <Label htmlFor="generatedContent">Generated LOR</Label>
              <Textarea
                id="generatedContent"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={18}
                className="font-serif min-h-[200px]"
                placeholder="Your generated letter will appear here."
                readOnly={!generatedContent}
              />
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LorGenerator;
