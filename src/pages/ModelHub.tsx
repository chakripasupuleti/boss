import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MathRenderer } from "@/components/MathRenderer";
import { 
  ChevronRight, 
  Play, 
  RotateCcw, 
  BarChart3, 
  Clock, 
  Target, 
  HelpCircle,
  AlertCircle 
} from "lucide-react";
import { useModelStats } from "@/hooks/useModelStats";
import { useTopicProgress } from "@/hooks/useTopicProgress";
import { toast } from "@/hooks/use-toast";

const modelContent = {
  "numbers": {
    "m1": {
      title: "Complex Number Powers",
      instruction: "Calculate the value of $i^{28} + 2$, where $i$ is the imaginary unit.",
      difficulty: "Medium",
      concept: "Powers of $i$ follow a pattern: $i^{1} = i$, $i^{2} = -1$, $i^{3} = -i$, $i^{4} = 1$, then repeats."
    },
    "m2": {
      title: "Rational Form Conversion",
      instruction: "Express $3.666...$ (recurring) in its simplest rational form.",
      difficulty: "Easy",
      concept: "Use algebraic method: let $x = 3.666...$, then $10x = 36.666...$, solve $10x - x = 33$."
    },
    "m3": {
      title: "Modular Arithmetic",
      instruction: "Find the remainder when $5^{104}$ is divided by $7$.",
      difficulty: "Hard",
      concept: "Use Fermat's Little Theorem or find the pattern in powers of $5$ modulo $7$."
    },
    "m4": {
      title: "Divisibility Rules",
      instruction: "Find the smallest value of $x$ such that $25796x25963$ is divisible by $11$.",
      difficulty: "Medium",
      concept: "For divisibility by $11$, the alternating sum of digits must be divisible by $11$."
    }
  },
  "lcm-hcf": {
    "m1": {
      title: "Basic HCF & LCM",
      instruction: "Find both the HCF and LCM of $30$ and $50$.",
      difficulty: "Easy",
      concept: "Use prime factorization or the relationship $HCF \times LCM = \text{product of numbers}$."
    },
    "m2": {
      title: "LCM of Fractions",
      instruction: "Find the LCM of $\\frac{7}{9}$, $\\frac{63}{8}$, and $\\frac{9}{7}$.",
      difficulty: "Medium",
      concept: "LCM of fractions $= \\frac{LCM \\text{ of numerators}}{HCF \\text{ of denominators}}$."
    },
    "m3": {
      title: "Ratio with HCF",
      instruction: "Two numbers are in ratio $2:3$ and their HCF is $9$. Find their LCM.",
      difficulty: "Medium",
      concept: "If numbers are in ratio $a:b$ with HCF $h$, numbers are $ah$ and $bh$."
    },
    "m4": {
      title: "Measurement Problem",
      instruction: "Find the greatest length that can exactly measure $14$m, $21$m, and $35$m.",
      difficulty: "Easy",
      concept: "The greatest common measure is the HCF of the given lengths."
    }
  },
  "percentages": {
    "m1": {
      title: "Percentage Relationships",
      instruction: "If $80\\%$ of $A$ equals $50\\%$ of $B$, what percentage of $A$ is $B$?",
      difficulty: "Medium",
      concept: "Set up equation: $0.8A = 0.5B$, then solve for $B$ in terms of $A$."
    },
    "m2": {
      title: "Fraction to Percentage",
      instruction: "$\\frac{3}{4}$ is what percent of $\\frac{1}{2}$?",
      difficulty: "Easy",
      concept: "Use formula: $ \\frac{3}{4} \\div \\frac{1}{2} \\times 100 = \\frac{3}{4} \\times \\frac{2}{1} \\times 100 $."
    },
    "m3": {
      title: "Percentage Decrease",
      instruction: "Staff decreased from $40$ to $29$. What is the percentage decrease?",
      difficulty: "Easy",
      concept: "$\\%\\ decrease = \\frac{\\text{Original - New}}{\\text{Original}} \\times 100$."
    },
    "m4": {
      title: "Chain Percentages",
      instruction: "Calculate $20\\%$ of $25\\%$ of $300$.",
      difficulty: "Easy",
      concept: "Convert percentages to decimals: $0.20 \\times 0.25 \\times 300$."
    }
  }
};



export default function ModelHub() {
  const { topic, model } = useParams();
  const currentModel = modelContent[topic as keyof typeof modelContent]?.[model as string];
  
  const { data: stats, isLoading: statsLoading } = useModelStats(topic || "", model || "");
  const { progress, updateProgress } = useTopicProgress(topic || "", model || "");

  const handleMarkCompleted = async () => {
    try {
      await updateProgress({ isCompleted: true });
      toast({
        title: "Success!",
        description: "Model marked as completed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark as completed",
        variant: "destructive",
      });
    }
  };

  if (!currentModel) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Model Not Found</h1>
          <p className="text-muted-foreground">The requested model could not be found.</p>
          <Link to="/courses">
            <Button className="mt-4">Back to Courses</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link to="/courses" className="hover:text-primary">Courses</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to="/courses/quant" className="hover:text-primary">Quantitative Aptitude</Link>
        <ChevronRight className="h-4 w-4" />
        <Link to={`/courses/quant/${topic}`} className="hover:text-primary capitalize">
          {topic?.replace('-', ' & ')}
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span className="uppercase">{model}</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-3xl font-bold">{currentModel.title}</h1>
          <Badge variant={
            currentModel.difficulty === "Easy" ? "secondary" : 
            currentModel.difficulty === "Medium" ? "outline" : "destructive"
          }>
            {currentModel.difficulty}
          </Badge>
        </div>
        <div className="text-muted-foreground">
          <MathRenderer>{currentModel.instruction}</MathRenderer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-card border text-center">
                  <Clock className="h-5 w-5 text-energy mx-auto mb-1" />
                  <div className="text-sm font-semibold">50 Seconds</div>
                  <div className="text-xs text-muted-foreground">Per Question</div>
                </div>
                <div className="p-3 rounded-lg bg-card border text-center">
                  <Target className="h-5 w-5 text-highlight mx-auto mb-1" />
                  <div className="text-sm font-semibold">Hint at 25s</div>
                  <div className="text-xs text-muted-foreground">Automatic Help</div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-accent mt-0.5" />
                  <div className="text-sm">
                    <strong>Dynamic Learning:</strong> After your first attempt, you can adjust question 
                    parameters to practice unlimited variations with AI-generated explanations.
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Practice</CardTitle>
              <CardDescription>Start or resume your practice session</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Link to={`/practice/${topic}/${model}`}>
                <Button variant="mathematical" size="lg" className="w-full">
                  <Play className="h-5 w-5 mr-2" />
                  Start Practice
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleMarkCompleted}
                disabled={progress?.is_completed}
              >
                <Target className="h-4 w-4 mr-2" />
                {progress?.is_completed ? "Completed ✓" : "Mark as Completed"}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statsLoading ? (
                <div className="text-center text-sm text-muted-foreground">Loading stats...</div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total Attempts</span>
                    <span className="font-medium">{stats?.totalAttempts || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Correct</span>
                    <span className="font-medium text-success">{stats?.correctAttempts || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Incorrect</span>
                    <span className="font-medium text-destructive">{stats?.incorrectAttempts || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Accuracy</span>
                    <span className="font-medium">{stats?.accuracy || 0}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Best Time</span>
                    <span className="font-medium">{stats?.bestTime ? `${stats.bestTime}s` : "-"}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}