"use client";

import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { model } from "@/ai/genkit";
import ReactMarkdown from 'react-markdown';
import { useUserStore } from '@/store/userStore';
import { useAIAssistantStore } from '@/store/aiAssistantStore';
import { HEADER_HEIGHT } from '@/lib/constants';

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function AIAssistantPanel() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your dashboard assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const users = useUserStore(state => state.users);
  const open = useAIAssistantStore(state => state.open);
  const setOpen = useAIAssistantStore(state => state.setOpen);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  const processAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const conversation = messages
        .map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
        .join('\n');
      const prompt = `
        You are a helpful dashboard assistant. Here is the current user data (in JSON):
        ${JSON.stringify(users, null, 2)}

        Conversation so far:
        ${conversation}

        The user has asked: ${userMessage}

        Please provide a helpful and concise response, using the user data and conversation above if relevant.
      `;

      const response = await model({
        model: "gemini-2.0-flash-001",
        contents: prompt,
      });

      return response.text ?? "";
    } catch (error) {
      console.error("Error processing AI response:", error);
      return "I'm sorry, I encountered an error processing your request. Please try again.";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await processAIResponse(userMessage);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={cn(
        'fixed right-0 w-[376px] bg-white shadow-xl z-50 transition-transform duration-300',
        open ? 'translate-x-0' : 'translate-x-full',
      )}
      style={{
        top: HEADER_HEIGHT,
        height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        willChange: 'transform',
        position: 'fixed',
        marginTop: '0px',
      }}
    >
      <Card className="h-full flex flex-col shadow-none border-none rounded-none">
        <CardHeader className="flex-none flex flex-row items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <Bot className="mr-2 h-5 w-5 text-primary" />
            AI Assistant
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setOpen(false)}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-4 min-h-0">
          <div className="flex-1 overflow-y-auto pr-4 mb-4">
            <div className="space-y-4">
              {messages.map((message, index) => {
                const isLast = index === messages.length - 1;
                return (
                  <div
                    key={index}
                    ref={isLast ? scrollRef : undefined}
                    className={cn(
                      "flex w-full",
                      message.role === "assistant"
                        ? "justify-start"
                        : "justify-end"
                    )}
                  >
                    <div
                      className={cn(
                        "rounded-lg px-4 py-2 max-w-[80%] break-words whitespace-pre-line overflow-x-auto",
                        message.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      )}
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                      }}
                    >
                      {message.role === "assistant"
                        ? <ReactMarkdown>{message.content}</ReactMarkdown>
                        : message.content
                      }
                    </div>
                  </div>
                );
              })}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-lg px-4 py-2 bg-muted text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex-none flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
