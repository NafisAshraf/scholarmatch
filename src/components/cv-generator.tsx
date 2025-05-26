"use client";
import React, { useState } from "react";
import CVForm, { CVData } from "@/components/cv-form";
import TemplateSelector from "@/components/template-selector";
import CVPreview from "@/components/cv-preview";
// import DownloadCVButton from "@/components/DownloadCVButton";

const defaultCV: CVData = {
  name: "Jane Doe",
  email: "jane@example.com",
  phone: "+1 555-1234",
  address: "123 Main St, Anytown",
  summary: "Creative and detail-oriented professional seeking opportunities.",
  education: [
    {
      school: "University Name",
      degree: "B.A. in Design",
      location: "City, Country",
      year: "2023",
      details: ["Graduated with honors", "Leadership in student club"],
    },
  ],
  experience: [
    {
      company: "ABC Corp",
      role: "Designer",
      location: "City, Country",
      duration: "2022-2023",
      description: ["Designed modern UIs."],
    },
  ],
  skills: ["Photoshop", "Figma", "Collaboration"],
  interests: [],
  recognitions: [],
  certifications: [],
  volunteering: [],
  achievements: [],
  references: [],
};

export default function CVGenerator() {
  const [cvData, setCVData] = useState<CVData>(defaultCV);
  const [template, setTemplate] = useState<"A" | "B">("B");

  return (
    <div className="h-screen w-full overflow-y-auto bg-gradient-to-tr from-indigo-50 via-white to-blue-50 flex flex-col md:flex-row">
      {/* Left: Form and template selector */}
      <div className="w-full md:w-1/2 bg-white border-r p-10 flex flex-col gap-8 shadow-md z-10">
        <h1 className="font-extrabold text-3xl mb-2 text-gradient">
          CV Generator
        </h1>
        <TemplateSelector selected={template} onSelect={setTemplate} />
        <CVForm value={cvData} onChange={setCVData} />
      </div>
      {/* Right: CV Preview + Download */}
      <div className="w-full md:w-1/2 flex flex-col items-center justify-between gap-0 bg-gradient px-0 md:px-10 py-10 relative">
        <div className="w-full flex justify-end pr-3">
          {/* <DownloadCVButton /> */}
        </div>
        <div className="grow w-full flex justify-center items-start">
          <CVPreview data={cvData} template={template} />
        </div>
      </div>
    </div>
  );
}
