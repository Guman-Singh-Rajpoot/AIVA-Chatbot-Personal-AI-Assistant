import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Bot, 
  Sparkles, 
  MessageSquare, 
  ShieldAlert, 
  Settings,
  User as UserIcon,
  Linkedin,
  Github
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "AI Assistant", href: "/assistant", icon: Bot },
  { name: "About Me", href: "/about", icon: UserIcon },
  { name: "Recommendations", href: "/recommendations", icon: Sparkles },
  { name: "Chat", href: "/chat", icon: MessageSquare },
  { name: "Fake News Detector", href: "/fake-news", icon: ShieldAlert },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex h-screen w-64 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center border-b border-sidebar-border px-6">
        <Sparkles className="mr-2 h-6 w-6 text-primary animate-pulse" />
        <span className="font-display text-xl font-bold tracking-wider">NEXUS</span>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href} className={cn(
                  "group flex items-center rounded-md px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-sidebar-accent text-primary shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground hover:translate-x-1"
                )}>
                  <item.icon
                    className={cn(
                      "mr-3 h-5 w-5 transition-colors",
                      isActive ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground"
                    )}
                  />
                  {item.name}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-sidebar-border p-4 space-y-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3 hover:bg-sidebar-accent transition-colors cursor-pointer group">
          <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px]">
            <div className="h-full w-full rounded-full bg-sidebar flex items-center justify-center">
              <span className="font-display font-bold text-xs">GR</span>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="truncate text-sm font-medium text-sidebar-foreground group-hover:text-primary transition-colors">Guman Singh Rajpoot</p>
            <p className="truncate text-xs text-sidebar-foreground/50">B.Tech CS Student</p>
          </div>
          <Settings className="h-4 w-4 text-sidebar-foreground/50 hover:text-primary transition-colors" />
        </div>

        <div className="flex gap-2 justify-center">
          <a 
            href="https://www.linkedin.com/in/guman-singh-06a082324/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-[#0077B5]/10 hover:bg-[#0077B5]/20 text-[#0077B5] transition-colors"
            title="Visit LinkedIn"
          >
            <Linkedin className="h-4 w-4" />
            <span className="text-xs font-medium">LinkedIn</span>
          </a>
          <a 
            href="https://github.com/Guman-Singh-Rajpoot" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 p-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-300 transition-colors"
            title="Visit GitHub"
          >
            <Github className="h-4 w-4" />
            <span className="text-xs font-medium">GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
