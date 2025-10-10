import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, Brain, TrendingUp, Clock, Target, Award } from "lucide-react";
import { useUserStats } from "@/hooks/useUserStats";

export default function Home() {
  const { stats, isLoading } = useUserStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Welcome to Aptitude Playground
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Master quantitative aptitude with our dynamic question engine and AI-powered explanations
        </p>
        <Link to="/courses">
          <Button variant="mathematical" size="lg" className="animate-pulse-glow">
            Start Learning
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <Card className="border-l-4 border-l-primary">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Questions Attempted</CardTitle>
            <Target className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : stats?.total_questions_attempted || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_questions_attempted ? "Keep practicing!" : "Start your journey"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-success">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? "..." : `${stats?.accuracy_percentage?.toFixed(1) || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_questions_attempted ? "Great progress!" : "Complete questions to see stats"}
            </p>
          </CardContent>
        </Card>
        
        <Card className="border-l-4 border-l-energy">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Time</CardTitle>
            <Clock className="h-4 w-4 text-energy" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading 
                ? "..." 
                : `${((stats?.total_study_time_minutes || 0) / 60).toFixed(1)}h`}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats?.total_study_time_minutes ? "Keep it up!" : "Track your progress"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20" />
          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Calculator className="h-6 w-6 text-primary" />
              <Badge variant="secondary">Available</Badge>
            </div>
            <CardTitle className="text-xl">Quantitative Aptitude</CardTitle>
            <CardDescription>
              Master numbers, percentages, and mathematical reasoning with dynamic questions
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Numbers</span>
                <span className="text-muted-foreground">4 models</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>LCM & HCF</span>
                <span className="text-muted-foreground">4 models</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Percentages</span>
                <span className="text-muted-foreground">4 models</span>
              </div>
            </div>
            <Link to="/courses/quant">
              <Button variant="mathematical" className="w-full">
                Explore Course
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40" />
          <CardHeader className="relative">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="h-6 w-6 text-muted-foreground" />
              <Badge variant="outline">Coming Soon</Badge>
            </div>
            <CardTitle className="text-xl text-muted-foreground">Logical Reasoning</CardTitle>
            <CardDescription>
              Develop critical thinking skills with pattern recognition and logical puzzles
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Pattern Recognition</span>
                <span>Coming Soon</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Logical Sequences</span>
                <span>Coming Soon</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Critical Reasoning</span>
                <span>Coming Soon</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-8">Why Choose Aptitude Playground?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Dynamic Questions</h3>
            <p className="text-sm text-muted-foreground">
              Practice with unlimited variations of each problem type
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">AI Explanations</h3>
            <p className="text-sm text-muted-foreground">
              Get personalized explanations powered by advanced AI
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Progress Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor your improvement with detailed analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}