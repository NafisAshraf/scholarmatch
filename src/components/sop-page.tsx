import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
// import { useToast } from '@/components/ui/use-toast';
import { toast } from "sonner";
import { Lightbulb, Send, Sparkles } from "lucide-react";

const WEBHOOK_URL = "YOUR_ZAPIER_WEBHOOK_URL_HERE"; // Replace this with your actual webhook URL

const SopPage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState("");
  // const { toast } = useToast();

  const handleGenerateContent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error("Missing Information", {
        description:
          "Please provide details about the scholarship and your background.",
      });
      return;
    }

    setIsGenerating(true);

    try {
      await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          action: "generate_sop",
          prompt: prompt,
          timestamp: new Date().toISOString(),
        }),
      });

      // Since we're using no-cors, we'll simulate a response after a delay
      setTimeout(() => {
        // This is a mock generated content
        const mockGeneratedContent = `Dear Scholarship Committee,

I am writing to express my sincere interest in the [Scholarship Name] as I believe it aligns perfectly with my academic goals and personal journey. Throughout my academic career, I have maintained a strong focus on [Field of Study] while actively engaging in extracurricular activities that demonstrate my leadership abilities and commitment to community service.

My passion for [Subject] began when [personal anecdote about your interest in the field]. This experience shaped my desire to pursue further education in this area and contribute meaningfully to advancements in the field. During my studies at [University/School], I have maintained a [GPA] while participating in [relevant projects or research].

I am particularly drawn to this scholarship because [reasons specific to this scholarship]. The values of [scholarship values] resonate deeply with my own personal philosophy of [your matching values]. If granted this opportunity, I would use it to [specific plans for using the scholarship].

Thank you for considering my application. I am excited about the possibility of becoming a part of your esteemed scholarship program and would be honored to represent the values it embodies.

Sincerely,
[Your Name]`;

        setGeneratedContent(mockGeneratedContent);
        setIsGenerating(false);

        toast.success("Content Generated", {
          description: "Your SOP draft has been generated.",
        });
      }, 3000);
    } catch (error) {
      console.error("Error generating content:", error);
      setIsGenerating(false);
      toast.error("Error", {
        description: "Failed to generate content. Please try again later.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12 bg-gradient-to-r from-white via-blue-50 to-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gradient mb-2">
              Statement of Purpose
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Get personalized assistance writing compelling statements of
              purpose and scholarship essays.
            </p>
          </div>

          <Tabs defaultValue="generate">
            <TabsList className="grid w-[60%] mx-auto grid-cols-2 mb-8 border-1">
              <TabsTrigger value="generate">Generate SOP</TabsTrigger>
              <TabsTrigger value="tips">Writing Tips</TabsTrigger>
            </TabsList>

            <TabsContent value="generate">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                <Card className=" h-full">
                  <CardHeader>
                    <CardTitle>Your Information</CardTitle>
                    <CardDescription>
                      Provide details about the scholarship and your background
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form
                      onSubmit={handleGenerateContent}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="prompt">
                          Scholarship Details & Your Background
                        </Label>
                        <Textarea
                          id="prompt"
                          placeholder="E.g., I'm applying for the Global Leaders Scholarship. I'm a 21-year-old computer science student with a 3.8 GPA. I have experience in web development and volunteer teaching coding to kids..."
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          rows={8}
                          required
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full mt-5"
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
                            Generate Content
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Generated Content</CardTitle>
                    <CardDescription>
                      Your AI-written draft (edit as needed)
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {generatedContent ? (
                      <Textarea
                        value={generatedContent}
                        onChange={(e) => setGeneratedContent(e.target.value)}
                        rows={16}
                        className="font-serif"
                      />
                    ) : (
                      <div className="border-2 border-dashed border-gray-200 rounded-md h-64 flex flex-col items-center justify-center p-4 text-center">
                        <Sparkles className="h-8 w-8 text-gray-300 mb-2" />
                        <p className="text-gray-500">
                          Your generated content will appear here
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          Fill out the form and click "Generate Content"
                        </p>
                      </div>
                    )}
                  </CardContent>
                  {generatedContent && (
                    <CardFooter className="justify-end">
                      <Button variant="outline" className="mr-2">
                        Copy
                      </Button>
                      <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </CardFooter>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="tips">
              <Card>
                <CardHeader>
                  <CardTitle>
                    Tips for Writing an Effective Statement of Purpose
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Tell Your Story
                    </h3>
                    <p className="text-gray-600">
                      Share your personal journey and the experiences that led
                      you to your field of study. Make it authentic and
                      compelling.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Be Specific
                    </h3>
                    <p className="text-gray-600">
                      Mention specific achievements, projects, or experiences
                      that demonstrate your skills and commitment to your field.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Align with the Scholarship
                    </h3>
                    <p className="text-gray-600">
                      Research the scholarship and tailor your statement to show
                      how your goals align with their mission and values.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Show Your Future Impact
                    </h3>
                    <p className="text-gray-600">
                      Explain how receiving this scholarship will help you
                      achieve your goals and make a positive impact in your
                      field or community.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center">
                      <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                      Proofread Carefully
                    </h3>
                    <p className="text-gray-600">
                      Even AI-generated content needs review. Check for
                      grammatical errors, clarity, and flow. Make sure it sounds
                      like your authentic voice.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default SopPage;
