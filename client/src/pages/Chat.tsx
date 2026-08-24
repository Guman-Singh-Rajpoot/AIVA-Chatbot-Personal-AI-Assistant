import { MainLayout } from "@/components/layout/MainLayout";
import { useRef, useEffect } from "react";
import { useState } from "react";
import { Phone, Video, MoreVertical, Send, MessageCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ChatMessage {
  id: string;
  channel: string;
  sender: "user" | "bot";
  content: string;
  createdAt: string;
}

const suggestedTopics = [
  "Who are you?",
  "Tell me about JNV",
  "What skills do you have?",
  "Tell me about your projects",
  "NCC & Awards?",
];

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function Chat() {
  const queryClient = useQueryClient();
  const [msgInput, setMsgInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading: isLoadingHistory } = useQuery<ChatMessage[]>({
    queryKey: ["/api/messages?channel=chat"],
  });

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", "/api/messages", { content, channel: "chat" });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages?channel=chat"] });
    },
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sendMessage.isPending]);

  const handleSendMessage = () => {
    if (!msgInput.trim() || sendMessage.isPending) return;
    sendMessage.mutate(msgInput);
    setMsgInput("");
  };

  const handleSuggestedTopic = (topic: string) => {
    if (sendMessage.isPending) return;
    sendMessage.mutate(topic);
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-6rem)] grid grid-cols-12 gap-6">
        {/* Info Panel */}
        <div className="col-span-12 md:col-span-4 lg:col-span-3 glass-card flex flex-col rounded-xl overflow-hidden">
          <div className="p-6 border-b border-border text-center">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-secondary mx-auto mb-4 flex items-center justify-center shadow-lg shadow-primary/50">
              <span className="text-2xl font-display font-bold text-white">GR</span>
            </div>
            <h2 className="font-display font-bold text-lg">Guman Singh Rajpoot</h2>
            <p className="text-sm text-primary font-medium">B.Tech CSE Student</p>
            <p className="text-xs text-muted-foreground mt-1">Sitare University, Lucknow</p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">💻 Tech Stack</h3>
                <div className="flex flex-wrap gap-1.5">
                  {["Python", "Java", "JavaScript", "React", "Node.js", "PostgreSQL"].map((skill) => (
                    <span key={skill} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-medium hover:bg-primary/20 transition-colors cursor-default">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">🏆 Achievements</h3>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>🎖️ NCC 'B' Certificate</p>
                  <p>🎓 100% Scholarship @ Sitare</p>
                  <p>🏅 JNV Mahoba: 84% (12th)</p>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">📍 Background</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  JNV Mahoba → Sitare University (CSE, Lucknow)
                </p>
              </div>

              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">🎯 Goal</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Skilled software engineer in backend development and AI systems
                </p>
              </div>

              <div className="pt-2 border-t border-border">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">❓ Try Asking</h3>
                <div className="space-y-2">
                  {suggestedTopics.map((topic, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSuggestedTopic(topic)}
                      disabled={sendMessage.isPending}
                      className="w-full text-left text-xs p-2 rounded-lg bg-primary/5 hover:bg-primary/10 text-muted-foreground hover:text-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-primary/20 hover:border-primary/40"
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* Chat Window */}
        <div className="col-span-12 md:col-span-8 lg:col-span-9 glass-card flex flex-col rounded-xl overflow-hidden">
          {/* Header */}
          <div className="p-4 border-b border-border flex justify-between items-center bg-background/50 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white font-bold">GR</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-display font-bold text-sm">Guman Singh Rajpoot</h3>
                <p className="text-xs text-green-500 flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" /> Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10"><Phone className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10"><Video className="h-4 w-4" /></Button>
              <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-foreground hover:bg-primary/10"><MoreVertical className="h-4 w-4" /></Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea ref={scrollRef} className="flex-1 p-6 bg-gradient-to-b from-transparent to-black/20">
            <div className="space-y-4">
              {!isLoadingHistory && messages.length === 0 && (
                <div className="flex justify-center py-8">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <MessageCircle className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm text-muted-foreground">Start a conversation! Pick a topic or ask anything.</p>
                  </div>
                </div>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card border border-border rounded-bl-none"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                    <p className={`text-[10px] mt-2 text-right ${msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                      {formatTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
              {sendMessage.isPending && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2">
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-white text-xs">GR</AvatarFallback>
                    </Avatar>
                    <div className="bg-card border border-border rounded-2xl px-4 py-3 rounded-bl-none">
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

          {/* Input */}
          <div className="p-4 bg-background/50 border-t border-border">
            <div className="flex items-center gap-2">
              <Input
                className="flex-1 bg-background border-input focus-visible:ring-primary"
                placeholder="Ask me anything..."
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !sendMessage.isPending && handleSendMessage()}
                disabled={sendMessage.isPending}
              />
              <Button
                size="icon"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full shadow-lg shadow-primary/20 disabled:opacity-50"
                onClick={handleSendMessage}
                disabled={sendMessage.isPending || !msgInput.trim()}
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
