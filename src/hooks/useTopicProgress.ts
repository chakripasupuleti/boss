import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export function useTopicProgress(topic: string, model: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: progress, isLoading } = useQuery({
    queryKey: ["topicProgress", user?.id, topic, model],
    queryFn: async () => {
      if (!user?.id) return null;

      const { data, error } = await supabase
        .from("topic_progress")
        .select("*")
        .eq("user_id", user.id)
        .eq("topic", topic)
        .eq("model", model)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const updateProgress = useMutation({
    mutationFn: async ({
      accuracy,
      isCompleted,
    }: {
      accuracy?: number;
      isCompleted?: boolean;
    }) => {
      if (!user?.id) throw new Error("No user");

      const currentProgress = progress || {
        user_id: user.id,
        topic,
        model,
        total_attempts: 0,
        best_accuracy: 0,
      };

      const newTotalAttempts = (currentProgress.total_attempts || 0) + 1;
      const newBestAccuracy = accuracy !== undefined 
        ? Math.max(currentProgress.best_accuracy || 0, accuracy)
        : currentProgress.best_accuracy;

      if (progress?.id) {
        const { data, error } = await supabase
          .from("topic_progress")
          .update({
            total_attempts: newTotalAttempts,
            best_accuracy: newBestAccuracy,
            is_completed: isCompleted ?? progress.is_completed ?? false,
            last_attempt_at: new Date().toISOString(),
          })
          .eq("id", progress.id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const { data, error } = await supabase
          .from("topic_progress")
          .insert({
            user_id: user.id,
            topic,
            model,
            total_attempts: newTotalAttempts,
            best_accuracy: newBestAccuracy || 0,
            is_completed: isCompleted || false,
            last_attempt_at: new Date().toISOString(),
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topicProgress", user?.id, topic, model] });
    },
  });

  return {
    progress,
    isLoading,
    updateProgress: updateProgress.mutateAsync,
  };
}
