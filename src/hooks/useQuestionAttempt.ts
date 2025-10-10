import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useQuestionAttempt() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const saveAttempt = useMutation({
    mutationFn: async ({
      sessionId,
      topic,
      model,
      questionText,
      userAnswer,
      correctAnswer,
      isCorrect,
      timeTakenSeconds,
      hintUsed,
      variableValues,
    }: {
      sessionId: string;
      topic: string;
      model: string;
      questionText: string;
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
      timeTakenSeconds: number;
      hintUsed: boolean;
      variableValues?: Record<string, number>;
    }) => {
      if (!user?.id) throw new Error("No user");

      const { data, error } = await supabase
        .from("question_attempts")
        .insert({
          user_id: user.id,
          session_id: sessionId,
          topic,
          model,
          question_text: questionText,
          user_answer: userAnswer,
          correct_answer: correctAnswer,
          is_correct: isCorrect,
          time_taken_seconds: timeTakenSeconds,
          hint_used: hintUsed,
          variable_values: variableValues,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["questionAttempts"] });
    },
  });

  return {
    saveAttempt: saveAttempt.mutateAsync,
  };
}
