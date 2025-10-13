import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Mail, Award } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserStats } from "@/hooks/useUserStats";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export default function Profile() {
  const { user } = useAuth();
  const { stats, isLoading: statsLoading } = useUserStats();

  // Fetch topic progress for Quantitative Aptitude
  const { data: topicProgress, isLoading: progressLoading } = useQuery({
    queryKey: ["topicProgress", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("topic_progress")
        .select("topic, model, is_completed")
        .eq("user_id", user.id);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: ["achievements", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("user_id", user.id)
        .order("unlocked_at", { ascending: false })
        .limit(5);
      return data || [];
    },
    enabled: !!user?.id,
  });

  // Calculate Quantitative Aptitude progress
  const quantTopics = ["numbers", "lcm-hcf", "percentages"];
  const totalModels = quantTopics.length * 4; // 3 topics × 4 models each
  const completedModels = topicProgress?.filter(
    (p) => quantTopics.includes(p.topic) && p.is_completed
  ).length || 0;
  const quantProgress = Math.round((completedModels / totalModels) * 100);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Profile</h1>
        <p className="text-muted-foreground">
          View your email and track your learning journey
        </p>
      </div>

      <div className="space-y-6">
        {/* Email Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="email">Email Address</Label>
              {statsLoading ? (
                <Skeleton className="h-10 w-full mt-2" />
              ) : (
                <Input 
                  id="email" 
                  type="email" 
                  value={user?.email || ""} 
                  className="mt-2" 
                  disabled 
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Learning Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-energy" />
              Learning Stats
            </CardTitle>
            <CardDescription>Track your progress across courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Quantitative Aptitude</span>
                {progressLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <span>{quantProgress}%</span>
                )}
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                {progressLoading ? (
                  <Skeleton className="h-full w-full" />
                ) : (
                  <div className="h-full bg-primary rounded-full" style={{ width: `${quantProgress}%` }}></div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Logical Reasoning</span>
                <Badge variant="outline" className="text-xs">Locked</Badge>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-muted-foreground rounded-full" style={{ width: '0%' }}></div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Recent Achievements</h4>
              {achievementsLoading ? (
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </div>
              ) : achievements && achievements.length > 0 ? (
                <div className="space-y-2">
                  {achievements.map((achievement) => (
                    <div key={achievement.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center">
                        <Award className="h-3 w-3 text-primary" />
                      </div>
                      <span className="text-sm">{achievement.achievement_name}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No achievements yet. Start practicing to unlock them!</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}