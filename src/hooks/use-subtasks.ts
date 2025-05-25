import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export interface Subtask {
  id: string;
  task_id: string;
  title: string;
  description: string;
  status: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export function useSubtasks(taskId: string | null) {
  return useQuery<Subtask[]>({
    queryKey: ["subtasks", taskId],
    queryFn: async () => {
      if (!taskId) return [];
      const supabase = createClient();
      const { data, error } = await supabase
        .from("subtasks")
        .select("*")
        .eq("task_id", taskId);
      if (error) throw new Error(error.message);
      return data || [];
    },
    enabled: !!taskId,
  });
}
