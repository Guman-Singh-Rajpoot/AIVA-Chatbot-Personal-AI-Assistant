import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Assistant from "@/pages/Assistant";
import AboutMe from "@/pages/AboutMe";
import Recommendations from "@/pages/Recommendations";
import Chat from "@/pages/Chat";
import FakeNews from "@/pages/FakeNews";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/assistant" component={Assistant} />
      <Route path="/about" component={AboutMe} />
      <Route path="/recommendations" component={Recommendations} />
      <Route path="/chat" component={Chat} />
      <Route path="/fake-news" component={FakeNews} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
