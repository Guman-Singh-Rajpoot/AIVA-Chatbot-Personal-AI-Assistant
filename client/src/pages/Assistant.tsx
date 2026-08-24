import { MainLayout } from "@/components/layout/MainLayout";
import { useEffect, useRef, useState } from "react";
import { Send, Bot, User, Mic, Paperclip, MoreVertical, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  channel: string;
  sender: "user" | "bot";
  content: string;
  createdAt: string;
}

interface Task {
  id: string;
  title: string;
  dueLabel: string;
  priority: "low" | "medium" | "high";
  completed: boolean;
  createdAt: string;
}

interface Memory {
  id: string;
  content: string;
  createdAt: string;
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Assistant() {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");
  const [newTask, setNewTask] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [] } = useQuery<ChatMessage[]>({
    queryKey: ["/api/messages?channel=assistant"],
  });

  const { data: tasks = [] } = useQuery<Task[]>({
    queryKey: ["/api/tasks"],
  });

  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: ["/api/memories"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", { content, channel: "assistant" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages?channel=assistant"] });
    },
  });

  const createTask = useMutation({
    mutationFn: async (title: string) => {
      const res = await apiRequest("POST", "/api/tasks", { title, dueLabel: "Today", priority: "medium" });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }),
  });

  const toggleTask = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const res = await apiRequest("PATCH", `/api/tasks/${id}`, { completed });
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }),
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => apiRequest("DELETE", `/api/tasks/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/tasks"] }),
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessage.isPending]);

  const handleSend = () => {
    if (!input.trim() || sendMessage.isPending) return;
    sendMessage.mutate(input);
    setInput("");
  };

  const handleAddTask = () => {
    if (!newTask.trim() || createTask.isPending) return;
    createTask.mutate(newTask);
    setNewTask("");
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <MainLayout>
      <div className="flex h-[calc(100vh-4rem)] gap-6">
        {/* Sidebar for Tasks/History */}
        <div className="hidden lg:flex w-80 flex-col gap-4">
           <div className="glass-card flex-1 rounded-xl p-4 flex flex-col overflow-hidden">
             <div className="flex items-center justify-between mb-4">
               <h3 className="font-display font-semibold">Active Tasks</h3>
               <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">{pendingCount} Pending</span>
             </div>

             <div className="flex items-center gap-2 mb-3">
               <Input
                 value={newTask}
                 onChange={(e) => setNewTask(e.target.value)}
                 onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                 placeholder="Add a task..."
                 className="h-8 text-sm"
               />
               <Button size="icon" className="h-8 w-8 shrink-0" onClick={handleAddTask} disabled={!newTask.trim()}>
                 <Plus className="h-4 w-4" />
               </Button>
             </div>

             <ScrollArea className="flex-1">
               <div className="space-y-3 pr-2">
                 {tasks.length === 0 && (
                   <p className="text-xs text-muted-foreground italic">No tasks yet — add one above.</p>
                 )}
                 {tasks.map((task) => (
                   <div key={task.id} className="p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-colors group">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <button
                          onClick={() => toggleTask.mutate({ id: task.id, completed: !task.completed })}
                          className={cn(
                            "font-medium text-sm text-left flex-1",
                            task.completed && "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </button>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className={`h-2 w-2 rounded-full ${task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`} />
                          <button
                            onClick={() => deleteTask.mutate(task.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">{task.dueLabel}</p>
                   </div>
                 ))}
               </div>
             </ScrollArea>
           </div>

           <div className="glass-card h-1/3 rounded-xl p-4 overflow-auto">
              <h3 className="font-display font-semibold mb-4">Memory Bank</h3>
              {memories.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">Nothing remembered yet.</p>
              ) : (
                memories.map((m) => (
                  <p key={m.id} className="text-xs text-muted-foreground italic mt-2">"{m.content}"</p>
                ))
              )}
           </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col glass-card rounded-xl overflow-hidden border-primary/20 shadow-[0_0_30px_rgba(0,0,0,0.3)]">
          <div className="p-4 border-b border-border flex items-center justify-between bg-background/30 backdrop-blur-xl">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50">
                 <Bot className="h-6 w-6 text-primary" />
               </div>
               <div>
                 <h2 className="font-display font-bold">Nexus AI</h2>
                 <p className="text-xs text-primary animate-pulse flex items-center gap-1">
                   <span className="h-1.5 w-1.5 rounded-full bg-primary inline-block" />
                   Online & Ready
                 </p>
               </div>
             </div>
             <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground">
               <MoreVertical className="h-5 w-5" />
             </Button>
          </div>

          <ScrollArea ref={scrollRef} className="flex-1 p-4 bg-gradient-to-b from-transparent to-background/20">
            <div className="space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    "flex w-full",
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  <div className={cn(
                    "flex gap-3 max-w-[80%]",
                    msg.sender === "user" ? "flex-row-reverse" : "flex-row"
                  )}>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                      msg.sender === "user" ? "bg-secondary/20 text-secondary" : "bg-primary/20 text-primary"
                    )}>
                      {msg.sender === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    <div className={cn(
                      "p-4 rounded-2xl text-sm shadow-sm",
                      msg.sender === "user"
                        ? "bg-secondary text-white rounded-tr-none"
                        : "bg-card border border-border text-foreground rounded-tl-none"
                    )}>
                      <p className="leading-relaxed whitespace-pre-line">{msg.content}</p>
                      <p className={cn(
                        "text-[10px] mt-2 opacity-70",
                         msg.sender === "user" ? "text-white" : "text-muted-foreground"
                      )}>{formatTime(msg.createdAt)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex w-full justify-start">
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="h-8 w-8 rounded-full flex items-center justify-center shrink-0 mt-1 bg-primary/20 text-primary">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="p-4 rounded-2xl text-sm shadow-sm bg-card border border-border rounded-tl-none">
                      <div className="flex gap-1">
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0s" }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.2s" }} />
                        <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0.4s" }} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t border-border bg-background/30 backdrop-blur-xl">
            <div className="flex items-center gap-2 bg-background/50 border border-input rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask Nexus anything..."
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-9"
                disabled={sendMessage.isPending}
              />
              <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary">
                <Mic className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleSend}
                size="icon"
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                disabled={sendMessage.isPending || !input.trim()}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
