import React from "react";
import { CVData } from "@/components/cv-form";
import TemplateA from "@/components/CVTemplates/TemplateA";
import TemplateB from "@/components/CVTemplates/TemplateB";

// For download, render preview inside this ID
export const CV_PREVIEW_ID = "cv-preview-root";

type Props = {
  data: CVData;
  template: "A" | "B";
};

// A4: 210mm x 297mm, ~794x1123px at 96dpi. We'll use px for screen, print uses mm if possible.
const PageFrame: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    id={CV_PREVIEW_ID}
    className="bg-white w-full h-[85vh] rounded-lg shadow-2xl border mx-auto p-10 relative overflow-auto"
  >
    {children}
  </div>
);

export default function CVPreview({ data, template }: Props) {
  return (
    <PageFrame>
      {template === "A" ? <TemplateA data={data} /> : <TemplateB data={data} />}
    </PageFrame>
  );
}
