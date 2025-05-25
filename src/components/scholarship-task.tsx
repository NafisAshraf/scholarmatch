import React from "react";
import { useSubtasks } from "@/hooks/use-subtasks";
import { Button } from "./ui/button";

const ScholarshipTask = ({ taskId }: { taskId: string }) => {
  const { data: subtasks, isLoading, error } = useSubtasks(taskId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading tasks</div>;

  return (
    <div className="mt-8 space-y-4">
      <h2 className="text-xl font-semibold border-b pb-5 mb-2">
        Application Tasks
      </h2>
      <div className="space-y-3">
        {subtasks?.map((subtask) => (
          <div
            key={subtask.id}
            className="flex items-center justify-between p-4 border-b bg-white"
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-gray-300"
                checked={subtask.status === "completed"}
                readOnly
              />
              <div>
                <h3 className="font-medium">{subtask.title}</h3>
                <p className="text-sm text-gray-600">{subtask.description}</p>
              </div>
            </div>
            {/* {subtask.title.toLowerCase().includes("upload") && (
              <div className="flex gap-2">
                <Button variant="outline">Upload</Button>
                <Button variant="gradient">Generate</Button>
              </div>
            )} */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ScholarshipTask;
