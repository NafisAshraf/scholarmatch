import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for generating Letter of Recommendation
const getSystemPrompt = (user_profile: string) => ({
  role: "system" as const,
  content: `You are an expert Letter of Recommendation (LOR) writer. Write a compelling LOR for ${user_profile}.

Your LOR should:
1. Be written in clear, professional English
2. Include a strong introduction establishing your relationship with the applicant
3. Highlight the applicant's academic performance and achievements
4. Provide specific examples of their skills, work ethic, and character
5. Include concrete instances where they demonstrated exceptional abilities
6. Compare them favorably to their peers
7. Address their potential for success in their chosen field
8. End with a strong recommendation and willingness to provide additional information

The LOR should be approximately 500 words. Focus on being specific and authentic while maintaining professional tone. Only write the LOR, no other text.`,
});

export async function POST(req: Request) {
  try {
    const { message, user_profile } = await req.json();

    // Generate the LOR
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        getSystemPrompt(user_profile),
        { role: "user", content: message },
      ],
    });

    const lor = completion.choices[0]?.message?.content;

    return NextResponse.json({ lor });
  } catch (error) {
    console.error("Error generating LOR:", error);
    return NextResponse.json(
      { error: "Failed to generate Letter of Recommendation" },
      { status: 500 }
    );
  }
}
