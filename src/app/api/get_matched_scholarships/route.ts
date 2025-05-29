import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt for finding matching scholarships
const getSystemPrompt = (user_profile: string) => ({
  role: "system" as const,
  content: `You are an expert scholarship advisor. Based on the following user profile, find relevant scholarships:

${user_profile}

Find 5-6 relevant scholarships as possible. Ensure all fields are properly filled. If information is not available, use appropriate default values. The deadline should be in the format "MM/DD/YYYY". Give a random deadline in the year 2026.`,
});

export async function POST(req: Request) {
  try {
    console.log("Received scholarship matching request");
    const { user_profile } = await req.json();
    console.log("User profile received:", user_profile);

    // Get Supabase client
    const supabase = await createClient();

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Generate scholarship matches
    console.log("Calling OpenAI API for scholarship matches");
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-search-preview",
      messages: [
        getSystemPrompt(user_profile),
        {
          role: "user",
          content: "Find matching scholarships based on the provided profile.",
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "scholarship_matches",
          strict: true,
          schema: {
            type: "object",
            properties: {
              scholarships: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    amount: { type: "string" },
                    university: { type: "string" },
                    degree_level: { type: "string" },
                    subject: { type: "string" },
                    eligible_nationality: { type: "string" },
                    country: { type: "string" },
                    deadline: { type: ["string", "null"] },
                    source_url: { type: "string" },
                    application_url: { type: "string" },
                    title: { type: "string" },
                    description: { type: "string" },
                    eligibility_criteria: {
                      type: "array",
                      items: { type: "string" },
                    },
                    application_procedure: {
                      type: "array",
                      items: { type: "string" },
                    },
                    matching_score: { type: "number" },
                  },
                  required: [
                    "amount",
                    "university",
                    "degree_level",
                    "subject",
                    "eligible_nationality",
                    "country",
                    "deadline",
                    "source_url",
                    "application_url",
                    "title",
                    "description",
                    "eligibility_criteria",
                    "application_procedure",
                    "matching_score",
                  ],
                  additionalProperties: false,
                },
              },
            },
            required: ["scholarships"],
            additionalProperties: false,
          },
        },
      },
    });
    console.log("OpenAI API response received");

    const scholarships = JSON.parse(
      completion.choices[0]?.message?.content || "[]"
    );
    console.log("Parsed scholarships:", scholarships);

    // Add status field to each scholarship
    const scholarshipsWithStatus = scholarships.scholarships.map(
      (scholarship: any) => ({
        ...scholarship,
        status: "matched",
        documents: {
          cv: [],
          lor: [],
          sop: [],
          others: [],
          english: [],
          transcript: [],
        },
      })
    );

    // Add UUIDs to scholarships and update user's profile
    const scholarshipsWithIds = scholarshipsWithStatus.map(
      (scholarship: any) => ({
        ...scholarship,
        id: crypto.randomUUID(),
      })
    );

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ scholarships: scholarshipsWithIds })
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      return NextResponse.json(
        { error: "Failed to update profile with scholarships" },
        { status: 500 }
      );
    }

    return NextResponse.json({ scholarships: scholarshipsWithStatus });
  } catch (error) {
    console.error("Error finding scholarships:", error);
    return NextResponse.json(
      { error: "Failed to find matching scholarships" },
      { status: 500 }
    );
  }
}
