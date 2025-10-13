import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BookOpen, FileText, Play, ChevronRight, Clock, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const topics = [
  {
    id: "numbers",
    title: "Numbers",
    description: "Complex numbers, rational forms, and number properties",
    models: 4,
    difficulty: "Medium",
    completed: 0
  },
  {
    id: "lcm-hcf",
    title: "LCM & HCF",
    description: "Least Common Multiple and Highest Common Factor problems",
    models: 4,
    difficulty: "Easy",
    completed: 0
  },
  {
    id: "percentages",
    title: "Percentages",
    description: "Percentage calculations and ratio problems",
    models: 4,
    difficulty: "Easy",
    completed: 0
  }
];

export default function QuantCourse() {
  const { topic } = useParams();
  const [selectedTopic, setSelectedTopic] = useState(topic || "numbers");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const currentTopic = topics.find(t => t.id === selectedTopic);

  // Fetch topic completion status
  const { data: topicCompletion } = useQuery({
    queryKey: ["topicCompletion", user?.id, selectedTopic],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data } = await supabase
        .from("topic_progress")
        .select("model, is_completed")
        .eq("user_id", user.id)
        .eq("topic", selectedTopic);
      return data || [];
    },
    enabled: !!user?.id && !!selectedTopic,
  });

  const isTopicComplete = topicCompletion?.filter((m) => m.is_completed).length === 4;

  // Mark topic as completed
  const markCompleteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("Not authenticated");
      
      // Update all 4 models for this topic
      const updates = [];
      for (let i = 1; i <= 4; i++) {
        const modelId = `m${i}`;
        
        // Check if record exists
        const { data: existing } = await supabase
          .from("topic_progress")
          .select("id")
          .eq("user_id", user.id)
          .eq("topic", selectedTopic)
          .eq("model", modelId)
          .maybeSingle();

        if (existing) {
          // Update existing record
          updates.push(
            supabase
              .from("topic_progress")
              .update({ is_completed: true })
              .eq("id", existing.id)
          );
        } else {
          // Insert new record
          updates.push(
            supabase
              .from("topic_progress")
              .insert({
                user_id: user.id,
                topic: selectedTopic,
                model: modelId,
                is_completed: true,
                total_attempts: 0,
                best_accuracy: 0,
              })
          );
        }
      }

      await Promise.all(updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["topicCompletion"] });
      queryClient.invalidateQueries({ queryKey: ["topicProgress"] });
      queryClient.invalidateQueries({ queryKey: ["allTopicProgress"] });
      toast({
        title: "Topic Completed!",
        description: `You've marked ${currentTopic?.title} as completed.`,
      });
    },
    onError: (error) => {
      console.error("Error marking topic complete:", error);
      toast({
        title: "Error",
        description: "Failed to mark topic as completed. Please try again.",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="flex h-full">
      {/* Topics Sidebar */}
      <div className="w-80 border-r border-border bg-card p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Quantitative Aptitude</h1>
          <p className="text-muted-foreground text-sm">
            Master mathematical reasoning and problem-solving
          </p>
        </div>

        <div className="space-y-3">
          {topics.map((topicItem) => (
            <div
              key={topicItem.id}
              onClick={() => setSelectedTopic(topicItem.id)}
              className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                selectedTopic === topicItem.id
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{topicItem.title}</h3>
                <Badge variant={topicItem.difficulty === "Easy" ? "secondary" : "outline"}>
                  {topicItem.difficulty}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {topicItem.description}
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{topicItem.models} models</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {currentTopic && (
          <div>
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Link to="/courses" className="hover:text-primary">Courses</Link>
                <ChevronRight className="h-4 w-4" />
                <Link to="/courses/quant" className="hover:text-primary">Quantitative Aptitude</Link>
                <ChevronRight className="h-4 w-4" />
                <span>{currentTopic.title}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
                    {currentTopic.title}
                    {isTopicComplete && (
                      <Badge variant="secondary" className="text-sm">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </h1>
                  <p className="text-muted-foreground">{currentTopic.description}</p>
                </div>
                <Button
                  onClick={() => markCompleteMutation.mutate()}
                  disabled={isTopicComplete || markCompleteMutation.isPending}
                  variant={isTopicComplete ? "secondary" : "default"}
                >
                  {isTopicComplete ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Completed
                    </>
                  ) : (
                    "Mark as Completed"
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((modelNum) => (
                    <Card key={modelNum} className="hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Model M{modelNum}</CardTitle>
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            50s
                          </Badge>
                        </div>
                        <CardDescription>
                          Practice model {modelNum} with dynamic question variations
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link 
                          to={`/courses/quant/${selectedTopic}/m${modelNum}`}
                          className="block"
                        >
                          <Button variant="mathematical" className="w-full">
                            <Play className="h-4 w-4 mr-2" />
                            Start
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}