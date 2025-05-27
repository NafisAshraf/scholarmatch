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

      // Find and update existing scholarship or add new one
      const existingIndex = scholarships.findIndex(
        (s) => s.id === scholarship.id
      );

      const defaultDocuments = {
        cv: [],
        lor: [],
        sop: [],
        others: [],
        english: [],
        transcript: [],
      };

      if (existingIndex !== -1) {
        scholarships[existingIndex] = {
          ...scholarship,
          status: "added",
          documents: scholarship.documents || defaultDocuments,
        };
      } else {
        scholarships.push({
          ...scholarship,
          status: "added",
          documents: scholarship.documents || defaultDocuments,
        });
      }

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

      // Find and update existing scholarship
      const existingIndex = scholarships.findIndex(
        (s) => s.id === scholarship.id
      );
      if (existingIndex !== -1) {
        scholarships[existingIndex] = {
          ...scholarship,
          status: "matched",
          documents: scholarship.documents || {
            cv: [],
            lor: [],
            sop: [],
            others: [],
            english: [],
            transcript: [],
          },
        };
      }

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
