"use client";
import React, { useState } from "react";
import MultiSelect from "@/components/multi-select";

const nationalityOptions = [
  { value: "Bangladeshi", label: "Bangladeshi" },
  { value: "Indian", label: "Indian" },
  { value: "Pakistani", label: "Pakistani" },
  { value: "Other", label: "Other" },
];

const destinationOptions = [
  { value: "USA", label: "USA" },
  { value: "UK", label: "UK" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
  { value: "Other", label: "Other" },
];

const degreeOptions = [
  { value: "Bachelors", label: "Bachelors" },
  { value: "Masters", label: "Masters" },
  { value: "PhD", label: "PhD" },
  { value: "Diploma", label: "Diploma" },
  { value: "Other", label: "Other" },
];

const subjectOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Business", label: "Business" },
  { value: "Medicine", label: "Medicine" },
  { value: "Arts", label: "Arts" },
  { value: "Science", label: "Science" },
  { value: "Other", label: "Other" },
];

const fundingOptions = [
  { value: "Full", label: "Full" },
  { value: "Partial", label: "Partial" },
  { value: "Other", label: "Other" },
];

export default function SearchPage() {
  const [nationality, setNationality] = useState("");
  const [destination, setDestination] = useState("");
  const [degree, setDegree] = useState("");
  const [subject, setSubject] = useState("");
  const [funding, setFunding] = useState("");

  return (
    <div className="min-h-screen flex flex-col items-center py-16 bg-gradient">
      <h1 className="text-5xl font-bold text-gradient py-16">
        Country Specific Scholarships
      </h1>
      <div className="bg-white/90 dark:bg-transparent rounded-lg shadow-lg p-6 flex flex-col w-full max-w-5xl">
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <MultiSelect
              id="nationality"
              value={nationality}
              onChange={setNationality}
              required
              options={nationalityOptions}
              placeholder="Your Nationality"
              label="Your Nationality"
            />
          </div>
          <div className="flex-1">
            <MultiSelect
              id="destination"
              value={destination}
              onChange={setDestination}
              required
              options={destinationOptions}
              placeholder="Study Destination"
              label="Study Destination"
            />
          </div>
          <div className="flex-1">
            <MultiSelect
              id="degree"
              value={degree}
              onChange={setDegree}
              required
              options={degreeOptions}
              placeholder="Degree Level"
              label="Degree Level"
            />
          </div>
          <button
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold px-8 rounded-lg flex items-center gap-2 mt-6 md:mt-0 self-end md:self-auto"
            type="button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z"
              />
            </svg>
            FIND
          </button>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <MultiSelect
              id="subject"
              value={subject}
              onChange={setSubject}
              options={subjectOptions}
              placeholder="Subjects"
              label="Subjects"
            />
          </div>
          <div className="flex-1">
            <MultiSelect
              id="funding"
              value={funding}
              onChange={setFunding}
              options={fundingOptions}
              placeholder="Funding Type"
              label="Funding Type"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
