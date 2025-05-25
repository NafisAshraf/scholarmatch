"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import Progress from "@/components/progress";
import { RadialChart } from "@/components/radial-chart";
import ScholarshipTask from "@/components/scholarship-task";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const [showEditor, setShowEditor] = useState(false);

  return (
    <div className="flex">
      {showEditor && (
        <div className="w-3/4 overflow-y-auto h-screen">
          <div className="p-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setShowEditor(false)}
                className="mb-4"
              >
                ← Back
              </Button>
            </div>
            <SimpleEditor />
          </div>
        </div>
      )}
      <div
        className={`flex gap-4 px-4 py-16 overflow-y-auto h-screen ${
          showEditor ? "w-1/4" : "w-full"
        } ${showEditor ? "text-xs" : ""}`}
      >
        <div className="mx-auto w-full max-w-2xl">
          <div className={`flex flex-col gap-8 ${showEditor ? "hidden" : ""}`}>
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">
                University of Bristol UK Think Big Scholarship
              </h1>
              <p className="text-muted-foreground">
                Open for International Students. Available for Undergraduate and
                Postgraduate programs in all subjects at University of Bristol.
                Application deadline: 23 Apr 2025.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">💲</span>
                  <span>Partial Funding</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">🏛️</span>
                  <span>University of Bristol</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">🎓</span>
                  <span>Undergraduate, Postgraduate</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📚</span>
                  <span>All Subjects</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">🌎</span>
                  <span>International Students</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📍</span>
                  <span>UK</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">📅</span>
                  <span>04/23/2025</span>
                </div>
              </div>
              <RadialChart percentage={80} label="Match" />
            </div>
          </div>
          <div>
            <ScholarshipTask taskId="2d6de5e4-185a-4fcf-a8d7-a61913760b94" />
            <div
              className={`flex pb-20 ${
                showEditor
                  ? "flex-col items-center justify-center gap-4"
                  : "items-center"
              } justify-between p-4 border-b bg-white`}
            >
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300"
                  checked={false}
                  readOnly
                />
                <div>
                  <h3 className="font-medium">Upload Personal Statement</h3>
                  <p className="text-sm text-gray-600">
                    Upload your personal statement document (PDF format)
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">Upload</Button>
                <Button variant="gradient" onClick={() => setShowEditor(true)}>
                  Generate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
