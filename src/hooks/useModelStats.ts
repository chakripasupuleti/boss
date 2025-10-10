import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useModelStats(topic: string, model: string) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["modelStats", user?.id, topic, model],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data: attempts, error } = await supabase
        .from("question_attempts")
        .select("*")
        .eq("user_id", user.id)
        .eq("topic", topic)
        .eq("model", model);

      if (error) throw error;

      const totalAttempts = attempts?.length || 0;
      const correctAttempts = attempts?.filter(a => a.is_correct).length || 0;
      const incorrectAttempts = totalAttempts - correctAttempts;
      const accuracy = totalAttempts > 0 ? (correctAttempts / totalAttempts) * 100 : 0;
      
      const correctTimes = attempts
        ?.filter(a => a.is_correct)
        .map(a => a.time_taken_seconds) || [];
      const bestTime = correctTimes.length > 0 ? Math.min(...correctTimes) : null;

      return {
        totalAttempts,
        correctAttempts,
        incorrectAttempts,
        accuracy: accuracy.toFixed(1),
        bestTime,
      };
    },
    enabled: !!user?.id,
  });
}
