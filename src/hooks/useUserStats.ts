import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useUserStats() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["userStats", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from("user_stats")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateStats = useMutation({
    mutationFn: async ({
      questionsAttempted,
      questionsCorrect,
      studyTimeMinutes,
    }: {
      questionsAttempted: number;
      questionsCorrect: number;
      studyTimeMinutes: number;
    }) => {
      if (!user?.id) throw new Error("No user");

      const newTotalAttempted = (stats?.total_questions_attempted || 0) + questionsAttempted;
      const newTotalCorrect = (stats?.total_questions_correct || 0) + questionsCorrect;
      const accuracy = newTotalAttempted > 0 
        ? (newTotalCorrect / newTotalAttempted) * 100 
        : 0;

      const { data, error } = await supabase
        .from("user_stats")
        .update({
          total_questions_attempted: newTotalAttempted,
          total_questions_correct: newTotalCorrect,
          accuracy_percentage: parseFloat(accuracy.toFixed(2)),
          total_study_time_minutes: (stats?.total_study_time_minutes || 0) + studyTimeMinutes,
          last_practice_date: new Date().toISOString(),
        })
        .eq("user_id", user.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userStats", user?.id] });
    },
  });

  return {
    stats,
    isLoading,
    updateStats: updateStats.mutate,
  };
}
