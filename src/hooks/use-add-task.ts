import { useMutation } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
// Toast
import { toast } from "sonner";

export interface StepInput {
  id: number;
  title: string;
  description: string;
  step_number: number;
  required_doc: number | null;
  scholarship_id: string;
}

interface AddTaskInput {
  scholarshipId: string;
  deadline: string | null;
  steps: StepInput[];
}

export function useAddTask() {
  return useMutation({
    mutationFn: async ({ scholarshipId, deadline, steps }: AddTaskInput) => {
      const supabase = createClient();
      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) throw new Error("User not authenticated");
      // Change the selected column to true
      const { error: updateError } = await supabase
        .from("user_scholarships")
        .update({ selected: true })
        .eq("user_id", user.id)
        .eq("scholarship_id", scholarshipId);

      // Insert into user_tasks
      const { data: task, error: taskError } = await supabase
        .from("user_tasks")
        .insert({
          user_id: user.id,
          scholarship_id: scholarshipId,
          deadline: deadline ? deadline : null,
        })
        .select("id")
        .single();
      if (taskError || !task)
        throw new Error(taskError?.message || "Failed to create task");
      // Insert subtasks
      const subtaskInserts = steps.map((step) => ({
        task_id: task.id,
        title: step.title,
        description: step.description,
      }));
      const { error: subtaskError } = await supabase
        .from("subtasks")
        .insert(subtaskInserts);
      if (subtaskError) throw new Error(subtaskError.message);
      return task.id;
    },
    onSuccess: () => {
      toast.success("Task added successfully");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });
}
