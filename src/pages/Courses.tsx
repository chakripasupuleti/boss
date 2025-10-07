import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calculator, Brain, Lock, ChevronRight } from "lucide-react";

export default function Courses() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Courses</h1>
        <p className="text-muted-foreground">
          Choose your learning path and master aptitude skills
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quantitative Aptitude */}
        <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                  <Calculator className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className="bg-success/20 text-success-foreground">
                  Available
                </Badge>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            
            <CardTitle className="text-2xl">Quantitative Aptitude</CardTitle>
            <CardDescription className="text-base">
              Master mathematical reasoning, number systems, and quantitative analysis
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Course Progress</span>
                <span className="text-muted-foreground">0%</span>
              </div>
              <Progress value={0} className="h-2" />
            </div>

            {/* Topics */}
            <div>
              <h4 className="font-semibold mb-3">Available Topics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Numbers</span>
                  <Badge variant="outline" className="text-xs">4 Models</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">LCM & HCF</span>
                  <Badge variant="outline" className="text-xs">4 Models</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <span className="text-sm font-medium">Percentages</span>
                  <Badge variant="outline" className="text-xs">4 Models</Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">12</div>
                <div className="text-xs text-muted-foreground">Total Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-secondary">50s</div>
                <div className="text-xs text-muted-foreground">Per Question</div>
              </div>
            </div>

            <Link to="/courses/quant" className="block">
              <Button variant="mathematical" size="lg" className="w-full">
                Start Learning
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Logical Reasoning (Locked) */}
        <Card className="relative overflow-hidden opacity-75">
          <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/30" />
          <CardHeader className="relative">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-muted/50 rounded-lg flex items-center justify-center">
                  <Brain className="h-5 w-5 text-muted-foreground" />
                </div>
                <Badge variant="outline" className="bg-muted text-muted-foreground">
                  Coming Soon
                </Badge>
              </div>
              <Lock className="h-5 w-5 text-muted-foreground" />
            </div>
            
            <CardTitle className="text-2xl text-muted-foreground">Logical Reasoning</CardTitle>
            <CardDescription>
              Develop critical thinking and logical analysis skills
            </CardDescription>
          </CardHeader>

          <CardContent className="relative space-y-6">
            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-muted-foreground">Course Progress</span>
                <span className="text-muted-foreground">Locked</span>
              </div>
              <Progress value={0} className="h-2 opacity-50" />
            </div>

            {/* Topics */}
            <div>
              <h4 className="font-semibold mb-3 text-muted-foreground">Upcoming Topics</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium text-muted-foreground">Pattern Recognition</span>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium text-muted-foreground">Logical Sequences</span>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Soon</Badge>
                </div>
                <div className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <span className="text-sm font-medium text-muted-foreground">Critical Reasoning</span>
                  <Badge variant="outline" className="text-xs text-muted-foreground">Soon</Badge>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-xs text-muted-foreground">Total Models</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-muted-foreground">-</div>
                <div className="text-xs text-muted-foreground">Per Question</div>
              </div>
            </div>

            <Button variant="outline" size="lg" className="w-full" disabled>
              <Lock className="h-4 w-4 mr-2" />
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Course Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-lg bg-card border">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Dynamic Questions</h3>
            <p className="text-sm text-muted-foreground">
              Each model provides unlimited practice variations with variable parameters
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-card border">
            <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Brain className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-semibold mb-2">AI Explanations</h3>
            <p className="text-sm text-muted-foreground">
              Get step-by-step explanations powered by Gemini for dynamic variations
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-card border">
            <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ChevronRight className="h-6 w-6 text-accent" />
            </div>
            <h3 className="font-semibold mb-2">Structured Learning</h3>
            <p className="text-sm text-muted-foreground">
              Progress through concepts, study materials, and practice models systematically
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}