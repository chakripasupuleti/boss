import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import Home from "./pages/Home";
import Journey from "./pages/Journey";
import Courses from "./pages/Courses";
import Profile from "./pages/Profile";
import QuantCourse from "./pages/QuantCourse";
import ModelHub from "./pages/ModelHub";
import PracticeRunner from "./pages/PracticeRunner";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="journey" element={<Journey />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/quant" element={<QuantCourse />} />
            <Route path="courses/quant/:topic" element={<QuantCourse />} />
            <Route path="courses/quant/:topic/:model" element={<ModelHub />} />
            <Route path="profile" element={<Profile />} />
          </Route>
          <Route path="practice/:topic/:model" element={<PracticeRunner />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
