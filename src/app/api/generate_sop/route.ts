import { NextResponse } from "next/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for generating Statement of Purpose
const getSystemPrompt = (user_profile: string) => ({
  role: "system" as const,
  content: `You are an expert Statement of Purpose (SOP) writer. Write a compelling SOP for ${user_profile}.

Your SOP should:
1. Be written in clear, professional English
2. Include a strong introduction that captures attention
3. Highlight the applicant's academic achievements and relevant skills
4. Explain their motivation for choosing this academic program
5. Demonstrate their understanding of the target university's academic environment
6. Show how their background makes them a good fit for the program
7. Include specific examples of academic and extracurricular achievements
8. End with a strong conclusion about their academic and career goals

The SOP should be approximately 500 words. Focus on being authentic and compelling while maintaining academic professionalism. Only write the SOP, no other text.`,
});

export async function POST(req: Request) {
  try {
    const { message, user_profile } = await req.json();

    // Generate the SOP
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-nano",
      messages: [
        getSystemPrompt(user_profile),
        { role: "user", content: message },
      ],
    });

    const sop = completion.choices[0]?.message?.content;

    return NextResponse.json({ sop });
  } catch (error) {
    console.error("Error generating SOP:", error);
    return NextResponse.json(
      { error: "Failed to generate Statement of Purpose" },
      { status: 500 }
    );
  }
}
