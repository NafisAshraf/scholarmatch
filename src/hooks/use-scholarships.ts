import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useScholarships() {
  return useQuery({
    queryKey: ["scholarships"],
    queryFn: async () => {
      const supabase = createClient();
      const { data, error } = await supabase.from("scholarships").select("*");
      if (error) throw new Error(error.message);
      return data;
    },
  });
}
