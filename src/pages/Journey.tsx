import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { MapPin, Clock, Target, Trophy } from "lucide-react";

export default function Journey() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Learning Journey</h1>
        <p className="text-muted-foreground">
          Track your progress and achievements across all courses
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Overall Progress
          </CardTitle>
          <CardDescription>Your achievement summary across all courses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">0</div>
              <div className="text-sm text-muted-foreground">Questions Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-success mb-1">0%</div>
              <div className="text-sm text-muted-foreground">Average Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-energy mb-1">0h</div>
              <div className="text-sm text-muted-foreground">Total Study Time</div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Course Completion</span>
              <span>0%</span>
            </div>
            <Progress value={0} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Learning Path */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Learning Timeline</h2>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>
          
          {/* Timeline Items */}
          <div className="space-y-8">
            {/* Started */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-success rounded-full flex items-center justify-center border-4 border-background relative z-10">
                <MapPin className="h-4 w-4 text-success-foreground" />
              </div>
              <Card className="flex-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Journey Started</CardTitle>
                    <Badge variant="secondary">Today</Badge>
                  </div>
                  <CardDescription>Welcome to Aptitude Playground!</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    You've taken the first step towards mastering quantitative aptitude. 
                    Start with any topic that interests you.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* First Course */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border-4 border-background relative z-10">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Card className="flex-1 opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Complete First Topic</CardTitle>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <CardDescription>Finish your first topic in Quantitative Aptitude</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Choose from Numbers, LCM & HCF, or Percentages to start your learning journey.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* First Perfect Score */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border-4 border-background relative z-10">
                <Trophy className="h-4 w-4 text-muted-foreground" />
              </div>
              <Card className="flex-1 opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">First Perfect Score</CardTitle>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <CardDescription>Get your first question correct on the first try</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Show your mastery by solving a question correctly within the time limit.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Speed Master */}
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center border-4 border-background relative z-10">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <Card className="flex-1 opacity-60">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Speed Master</CardTitle>
                    <Badge variant="outline">Upcoming</Badge>
                  </div>
                  <CardDescription>Solve a question in under 30 seconds</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Demonstrate your expertise by solving questions quickly and accurately.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-energy" />
            Achievements
          </CardTitle>
          <CardDescription>Unlock badges as you progress through your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "First Steps", description: "Started your journey", locked: false },
              { name: "Quick Learner", description: "Complete first topic", locked: true },
              { name: "Perfect Score", description: "100% accuracy", locked: true },
              { name: "Speed Demon", description: "Under 30s solve", locked: true },
              { name: "Consistency", description: "7-day streak", locked: true },
              { name: "Explorer", description: "Try all topics", locked: true },
              { name: "Master", description: "Complete all models", locked: true },
              { name: "Champion", description: "Top performer", locked: true }
            ].map((achievement) => (
              <div
                key={achievement.name}
                className={`p-4 rounded-lg border text-center ${
                  achievement.locked ? 'opacity-50' : 'border-primary bg-primary/5'
                }`}
              >
                <div className={`w-12 h-12 rounded-full border-2 mx-auto mb-2 flex items-center justify-center ${
                  achievement.locked ? 'border-muted' : 'border-primary bg-primary/10'
                }`}>
                  <Trophy className={`h-6 w-6 ${achievement.locked ? 'text-muted-foreground' : 'text-primary'}`} />
                </div>
                <h4 className="font-semibold text-sm mb-1">{achievement.name}</h4>
                <p className="text-xs text-muted-foreground">{achievement.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}