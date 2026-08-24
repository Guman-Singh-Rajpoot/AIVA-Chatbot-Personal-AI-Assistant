import { MainLayout } from "@/components/layout/MainLayout";
import { useState } from "react";
import { ShieldAlert, AlertTriangle, CheckCircle, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

const factCheckingTips = [
  {
    title: "Check the Source",
    description: "Verify the news comes from a reputable, established news outlet. Check the website URL for legitimacy and look for author attribution.",
    icon: "🔍"
  },
  {
    title: "Cross-Reference",
    description: "Check if multiple credible sources are reporting the same story. If major outlets aren't covering it, be skeptical.",
    icon: "✓"
  },
  {
    title: "Verify Images & Videos",
    description: "Use reverse image search to check if photos are authentic or have been doctored/repurposed from other contexts.",
    icon: "📸"
  },
  {
    title: "Check Publication Date",
    description: "Ensure the story wasn't published years ago and is being shared out of context as 'breaking news'.",
    icon: "📅"
  },
  {
    title: "Look for Red Flags",
    description: "Excessive capital letters, sensational headlines, poor grammar, and emotional manipulation are common in fake news.",
    icon: "⚠️"
  },
  {
    title: "Fact-Check Organizations",
    description: "Use Snopes, FactCheck.org, PolitiFact, or Reuters Fact Check to verify claims before sharing.",
    icon: "✅"
  },
];

const commonRedFlags = [
  "Sensational or ALL CAPS headlines designed to provoke emotion",
  "No author attribution or vague 'sources say' without specifics",
  "Absence of timestamps or clearly identified publication dates",
  "Heavy use of emotional language, fear-mongering, or outrage",
  "Unverified quotes or attributed to anonymous sources",
  "No links to credible sources or citations",
  "Images that appear manipulated or taken out of context",
  "Claims that contradict established, verified facts",
  "Clickbait headers that don't match article content",
  "Excessive ads or pop-ups indicating low credibility",
];

interface AnalysisResult {
  score: number;
  label: string;
  confidence: number;
  reasons: string[];
}

export default function FakeNews() {
  const [text, setText] = useState("");

  const analyze = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/news/analyze", { text: content });
      return (await res.json()) as AnalysisResult;
    },
  });

  const handleAnalyze = () => {
    if (!text.trim()) return;
    analyze.mutate(text);
  };

  const result = analyze.data ?? null;
  const isAnalyzing = analyze.isPending;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-red-500/10 mb-4">
            <ShieldAlert className="h-8 w-8 text-red-500" />
          </div>
          <h1 className="text-4xl font-display font-bold">Fake News Detector</h1>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Analyze articles, headlines, or snippets using our advanced NLP models to detect potential misinformation.
          </p>
        </div>

        <div className="glass-card rounded-xl p-8 shadow-2xl border-primary/10">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground">Content to Analyze</label>
            <Textarea 
              placeholder="Paste article text or URL here..." 
              className="min-h-[200px] bg-background/50 border-input focus:border-primary/50 text-base resize-none"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="flex justify-end">
              <Button 
                size="lg" 
                onClick={handleAnalyze} 
                disabled={isAnalyzing || !text}
                className={cn("w-full md:w-auto min-w-[150px]", isAnalyzing ? "opacity-80" : "")}
              >
                {isAnalyzing ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4" /> Analyze Content
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Fact-Checking Tips */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold text-foreground">How to Spot Fake News</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {factCheckingTips.map((tip, i) => (
              <div key={i} className="glass-card rounded-lg p-5 hover:border-primary/50 transition-colors">
                <div className="text-3xl mb-3">{tip.icon}</div>
                <h3 className="font-display font-semibold text-foreground mb-2">{tip.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{tip.description}</p>
              </div>
            ))}
          </div>

          <div className="glass-card rounded-xl p-6">
            <h3 className="font-display text-xl font-semibold mb-4 text-foreground">Common Red Flags 🚩</h3>
            <div className="grid md:grid-cols-2 gap-3">
              {commonRedFlags.map((flag, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                  <span className="text-red-500 font-bold mt-0.5">•</span>
                  <p className="text-sm text-muted-foreground">{flag}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {result && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="grid md:grid-cols-2 gap-6">
               {/* Score Card */}
               <div className="glass-card rounded-xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
                 <div className={`absolute inset-0 opacity-10 ${result.score > 50 ? 'bg-green-500' : 'bg-red-500'}`} />
                 
                 <div className="relative z-10">
                   <h3 className="text-sm font-medium uppercase tracking-widest text-muted-foreground mb-4">Authenticity Score</h3>
                   <div className="relative inline-flex items-center justify-center">
                     <svg className="w-40 h-40 transform -rotate-90">
                       <circle
                         className="text-muted/20"
                         strokeWidth="12"
                         stroke="currentColor"
                         fill="transparent"
                         r="70"
                         cx="80"
                         cy="80"
                       />
                       <circle
                         className={result.score > 50 ? "text-green-500" : "text-red-500"}
                         strokeWidth="12"
                         strokeDasharray={440}
                         strokeDashoffset={440 - (440 * result.score) / 100}
                         strokeLinecap="round"
                         stroke="currentColor"
                         fill="transparent"
                         r="70"
                         cx="80"
                         cy="80"
                         style={{ transition: "stroke-dashoffset 1s ease-in-out" }}
                       />
                     </svg>
                     <div className="absolute inset-0 flex items-center justify-center flex-col">
                       <span className="text-3xl font-bold font-display">{Math.round(result.score)}%</span>
                       <span className="text-xs uppercase">{result.score > 50 ? "Real" : "Fake"}</span>
                     </div>
                   </div>
                 </div>
               </div>
               
               {/* Details Card */}
               <div className="glass-card rounded-xl p-6">
                 <h3 className="font-display text-lg font-bold mb-4 flex items-center gap-2">
                   {result.score > 50 ? <CheckCircle className="text-green-500 h-5 w-5"/> : <AlertTriangle className="text-red-500 h-5 w-5"/>}
                   Analysis Report
                 </h3>
                 
                 <div className="space-y-6">
                   <div>
                     <div className="flex justify-between text-sm mb-2">
                       <span className="text-muted-foreground">Model Confidence</span>
                       <span className="font-mono">{result.confidence}%</span>
                     </div>
                     <Progress value={result.confidence} className="h-2" />
                   </div>
                   
                   <div className="p-4 rounded-lg bg-muted/50 text-sm space-y-2">
                     {result.reasons.map((reason, i) => (
                       <p key={i} className="flex gap-2">
                         <Info className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                         <span className="text-muted-foreground">{reason}</span>
                       </p>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
