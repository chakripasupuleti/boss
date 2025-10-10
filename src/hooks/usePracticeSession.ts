import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function usePracticeSession() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const startSession = useMutation({
    mutationFn: async ({ topic, model }: { topic: string; model: string }) => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("practice_sessions")
        .insert({
          user_id: user.id,
          topic,
          model,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
  });

  const endSession = useMutation({
    mutationFn: async ({
      sessionId,
      totalQuestions,
      correctAnswers,
      timeSpentSeconds,
    }: {
      sessionId: string;
      totalQuestions: number;
      correctAnswers: number;
      timeSpentSeconds: number;
    }) => {
      const { data, error } = await supabase
        .from("practice_sessions")
        .update({
          completed_at: new Date().toISOString(),
          total_questions: totalQuestions,
          correct_answers: correctAnswers,
          time_spent_seconds: timeSpentSeconds,
        })
        .eq("id", sessionId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["practiceSessions"] });
    },
  });

  return {
    startSession: startSession.mutateAsync,
    endSession: endSession.mutateAsync,
  };
}
