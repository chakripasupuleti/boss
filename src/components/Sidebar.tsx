import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Home, 
  BookOpen, 
  Target, 
  User, 
  LogOut,
  Menu,
  X,
  Calculator,
  Brain
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigationItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "My Journey", url: "/journey", icon: Target },
  { title: "Courses", url: "/courses", icon: BookOpen },
  { title: "Profile", url: "/profile", icon: User },
];

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <div className={cn(
      "flex flex-col h-screen bg-card border-r border-border transition-all duration-300",
      isCollapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Aptitude Playground
            </span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200",
                isActive(item.url)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="font-medium">{item.title}</span>}
            </NavLink>
          ))}
        </div>

        {/* Course Quick Access */}
        {!isCollapsed && (
          <div className="mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 px-3">
              Quick Access
            </h3>
            <div className="space-y-2">
              <NavLink
                to="/courses/quant"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
              >
                <Calculator className="h-4 w-4" />
                <span>Quantitative Aptitude</span>
              </NavLink>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground/50">
                <Brain className="h-4 w-4" />
                <span>Logical Reasoning</span>
                <span className="ml-auto text-xs bg-muted px-2 py-1 rounded">Soon</span>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-4 w-4" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}