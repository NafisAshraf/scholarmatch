"use client";
import React from "react";
import { useScholarships } from "@/hooks/use-scholarships";
import { useUserScholarships } from "@/hooks/use-user-scholarships";
import { ScholarshipCard } from "@/components/scholarship-card";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

const page = () => {
  const {
    data: scholarships,
    isPending: isLoadingScholarships,
    error: errorScholarships,
  } = useScholarships();

  return (
    <>
      <div className="max-w-4xl mx-auto overflow-y-auto h-screen">
        <SimpleEditor />
      </div>
    </>
  );
};

export default page;
