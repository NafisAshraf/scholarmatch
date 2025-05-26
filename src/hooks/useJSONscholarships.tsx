import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

export function useJSONScholarships() {
  return useQuery({
    queryKey: ["json-user-scholarships"],
    queryFn: async () => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("profiles")
        .select("scholarships")
        .eq("user_id", user.id)
        .single();

      if (error) throw new Error(error.message);
      return data?.scholarships || [];
    },
  });
}

export function useAddJSONScholarship() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (scholarship: any) => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);
      if (!user) throw new Error("No user found");

      // Fetch current scholarships
      const { data, error } = await supabase
        .from("profiles")
        .select("scholarships")
        .eq("user_id", user.id)
        .single();
      if (error) throw new Error(error.message);
      let scholarships: any[] = data?.scholarships || [];

      scholarships[scholarship.id] = {
        ...scholarship,
        status: "added",
      };
      console.log(scholarships);
      console.log(scholarship.id);
      console.log(scholarship);

      // Update scholarships in DB
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ scholarships })
        .eq("user_id", user.id);
      if (updateError) throw new Error(updateError.message);
      return scholarships;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["json-user-scholarships"] });
    },
  });
}

export function useRemoveJSONScholarship() {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (scholarship: any) => {
      const supabase = createClient();
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError) throw new Error(userError.message);
      if (!user) throw new Error("No user found");

      // Fetch current scholarships
      const { data, error } = await supabase
        .from("profiles")
        .select("scholarships")
        .eq("user_id", user.id)
        .single();
      if (error) throw new Error(error.message);
      let scholarships: any[] = data?.scholarships || [];

      // // Check if scholarship with same title exists
      // const idx = scholarships.findIndex(
      //   (s: any) => s.title === scholarship.title
      // );
      // if (idx !== -1) {
      //   scholarships[idx] = { ...scholarship, status: "matched" };
      // }
      scholarships[scholarship.id] = {
        ...scholarship,
        status: "matched",
      };
      console.log(scholarships);
      console.log(scholarship.id);
      console.log(scholarship);

      // Update scholarships in DB
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ scholarships })
        .eq("user_id", user.id);
      if (updateError) throw new Error(updateError.message);
      return scholarships;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["json-user-scholarships"] });
    },
  });
}
