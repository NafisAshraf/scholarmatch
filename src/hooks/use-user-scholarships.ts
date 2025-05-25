import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useUserScholarships() {
  return useQuery({
    queryKey: ["user-scholarships"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("user_scholarships")
        .select(
          `
          *,
          scholarships (
            *,
            scholarship_countries (
              countries (*)
            ),
            scholarship_degree_levels (
              degree_levels (*)
            ),
            scholarship_subjects (
              subjects (*)
            ),
            scholarship_funding_types (
              funding_types (*)
            ),
            steps (*)
          )
        `
        )
        .eq("user_id", user.id);

      if (error) throw new Error(error.message);
      return data;
    },
  });
}
