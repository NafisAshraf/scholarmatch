"use client";

import { Generate } from "@/components/generate";
import ProfileDropdown from "@/components/profile-dropdown";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BoxIcon, HouseIcon, PanelsTopLeftIcon } from "lucide-react";
import SopPage from "@/components/sop-page";
import ScholarshipDetails from "@/components/scholarship-details";
import CVGenerator from "@/components/cv-generator";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import ScholarshipDocuments from "@/components/scholarship-documents";
import LorGenerator from "@/components/lor-generator";

const Index = () => {
  const params = useParams();

  const tabs = [
    {
      id: "tab-0",
      label: "Overview",
      component: <ScholarshipDetails />,
    },
    { id: "tab-1", label: "Generate CV", component: <CVGenerator /> },
    { id: "tab-2", label: "Generate SOP", component: <SopPage /> },
    {
      id: "tab-3",
      label: "Generate LOR",
      component: <LorGenerator />,
    },
    {
      id: "tab-4",
      label: "Documents",
      component: <ScholarshipDocuments />,
    },
  ];

  return (
    <div className="">
      <Tabs
        defaultValue="tab-0"
        orientation="vertical"
        className="w-full flex-row gap-0"
      >
        <TabsList className=" sticky top-0 flex-col w-sm py-6 h-screen border-r justify-start gap-3 text-black dark:text-white rounded-none">
          <p className="text-xl font-bold text-start me-auto px-6 pb-5 border-b">
            University of Bristol UK Think Big Scholarship
          </p>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="w-[90%] mx-auto justify-start text-cyan-700 dark:text-cyan-300 hover:text-cyan-900 dark:hover:text-cyan-100 hover:bg-cyan-100/50 dark:hover:bg-cyan-900/30 hover:cursor-pointer text-md data-[state=active]:bg-white dark:data-[state=active]:bg-cyan-900/50 data-[state=active]:text-cyan-900 dark:data-[state=active]:text-cyan-100 data-[state=active]:border-l-4 data-[state=active]:border-cyan-500 dark:data-[state=active]:border-cyan-400 "
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        <div className="w-full rounded-md  text-start ">
          {tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id}>
              {tab.component}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export default Index;
