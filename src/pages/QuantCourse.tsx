import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, BookOpen, FileText, Play, ChevronRight, Clock } from "lucide-react";

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

  const currentTopic = topics.find(t => t.id === selectedTopic);

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
              <h1 className="text-3xl font-bold mb-2">{currentTopic.title}</h1>
              <p className="text-muted-foreground">{currentTopic.description}</p>
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