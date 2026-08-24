import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/stat-card";
import { Code2, Award, BookOpen, Zap, ArrowUpRight, Activity, Linkedin, MessageCircle, Github, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface DashboardStats {
  totalChatMessages: number;
  totalTasks: number;
  completedTasks: number;
  totalAnalyses: number;
}

export default function Dashboard() {
  const { data: stats } = useQuery<DashboardStats>({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <MainLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, Guman</h1>
          <p className="text-muted-foreground">B.Tech CS Student | Sitare University | 100% Scholarship Holder</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Projects Completed"
            value="3"
            trend="up"
            trendValue="+1"
            description="this semester"
            icon={Code2}
          />
          <StatCard
            title="Technical Skills"
            value="16"
            trend="up"
            trendValue="+3"
            description="languages & tools"
            icon={Zap}
          />
          <StatCard
            title="Academic GPA"
            value="6.7"
            trend="neutral"
            description="current performance"
            icon={BookOpen}
          />
          <StatCard
            title="100% Scholarship"
            value="Active"
            trend="up"
            trendValue="Oct'25"
            description="B.Tech CS Award"
            icon={Award}
          />
        </div>

        {/* Live App Activity (from database) */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="glass-card rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Chat Messages</p>
              <p className="text-2xl font-display font-bold">{stats?.totalChatMessages ?? "—"}</p>
            </div>
            <MessageCircle className="h-8 w-8 text-primary/40" />
          </div>
          <div className="glass-card rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Tasks</p>
              <p className="text-2xl font-display font-bold">
                {stats ? `${stats.completedTasks}/${stats.totalTasks}` : "—"}
              </p>
              <p className="text-xs text-muted-foreground">completed</p>
            </div>
            <Zap className="h-8 w-8 text-primary/40" />
          </div>
          <div className="glass-card rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Fake News Checks</p>
              <p className="text-2xl font-display font-bold">{stats?.totalAnalyses ?? "—"}</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-primary/40" />
          </div>
        </div>

        {/* Social Profiles Card */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* LinkedIn Activity Card */}
          <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-[#0077B5]/10 to-[#0077B5]/5 border-l-4 border-l-[#0077B5]">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-[#0077B5]/20 flex items-center justify-center">
                  <Linkedin className="h-6 w-6 text-[#0077B5]" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">LinkedIn Profile</h3>
                  <p className="text-sm text-muted-foreground mb-3">guman-singh-06a082324</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    B.Tech CS Student at Sitare University. Full-stack developer & innovator.
                  </p>
                  <a 
                    href="https://www.linkedin.com/in/guman-singh-06a082324/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-[#0077B5] hover:bg-[#005885] text-white transition-colors font-medium text-sm"
                  >
                    <Linkedin className="h-4 w-4" /> View Profile
                  </a>
                </div>
              </div>
              <MessageCircle className="h-5 w-5 text-[#0077B5]/50 animate-pulse" />
            </div>
          </div>

          {/* GitHub Profile Card */}
          <div className="glass-card rounded-xl p-6 bg-gradient-to-br from-gray-500/10 to-gray-500/5 border-l-4 border-l-gray-500">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-gray-500/20 flex items-center justify-center">
                  <Github className="h-6 w-6 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-foreground mb-1">GitHub Repository</h3>
                  <p className="text-sm text-muted-foreground mb-3">Guman-Singh-Rajpoot</p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Check out my projects, code repositories, and contributions to open source.
                  </p>
                  <a 
                    href="https://github.com/Guman-Singh-Rajpoot" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition-colors font-medium text-sm"
                  >
                    <Github className="h-4 w-4" /> View GitHub
                  </a>
                </div>
              </div>
              <Code2 className="h-5 w-5 text-gray-500/50 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          {/* Recent Activity Feed */}
          <div className="col-span-4 glass-card rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display text-lg font-semibold">System Activity</h3>
              <Activity className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-6">
              {[
                { time: "1 week ago", title: "HomeFinder Project", desc: "Deployed property discovery platform with HTML, CSS, JavaScript & REST APIs", icon: Code2, color: "text-blue-400" },
                { time: "2 weeks ago", title: "LeetCode Tracker Built", desc: "Full-stack analytics dashboard with React, Node.js, PostgreSQL & Tailwind", icon: Zap, color: "text-purple-400" },
                { time: "3 weeks ago", title: "Scholarship Awarded", desc: "100% B.Tech CS Scholarship from Sitare University (Oct'25-Present)", icon: Award, color: "text-yellow-400" },
                { time: "1 month ago", title: "LDU Factorization Tool", desc: "Mathematical computing tool for step-by-step matrix factorization", icon: BookOpen, color: "text-green-400" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-4 border-l-2 border-border pl-4 relative group">
                  <div className={`absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-background border-2 border-muted group-hover:border-primary transition-colors`} />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">{item.time}</p>
                    <div className="flex items-center gap-2">
                      <item.icon className={`h-4 w-4 ${item.color}`} />
                      <p className="font-medium text-sm text-foreground">{item.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-span-3 glass-card rounded-xl p-6">
            <h3 className="font-display text-lg font-semibold mb-6">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "View Projects", icon: Code2, color: "bg-blue-500/10 text-blue-500 hover:bg-blue-500/20" },
                { label: "Edit Profile", icon: Award, color: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20" },
                { label: "Resume", icon: BookOpen, color: "bg-green-500/10 text-green-500 hover:bg-green-500/20" },
                { label: "Recommendations", icon: Zap, color: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20" },
              ].map((action, i) => (
                <button
                  key={i}
                  className={`flex flex-col items-center justify-center p-4 rounded-lg transition-all ${action.color} border border-transparent hover:border-white/10`}
                >
                  <action.icon className="h-6 w-6 mb-2" />
                  <span className="text-sm font-medium">{action.label}</span>
                </button>
              ))}
            </div>
            
            <div className="mt-8 p-4 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/20">
               <div className="flex justify-between items-start">
                 <div>
                   <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Current Status</p>
                   <p className="font-display font-bold text-lg">Building & Learning</p>
                 </div>
                 <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]" />
               </div>
               <p className="text-xs text-muted-foreground mt-2">Expected Graduation: May'27</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
