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

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface AIAssistantPanelProps {
  dashboardData: any;
}

export function AIAssistantPanel({ dashboardData }: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your dashboard assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [messages]);

  const processAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const prompt = `
        You are a helpful dashboard assistant. Here is the current dashboard data (in JSON):
        ${JSON.stringify(dashboardData, null, 2)}

        The user has asked: ${userMessage}

        Please provide a helpful and concise response, using the dashboard data above if relevant.
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
    <>
      {/* Floating Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg transition-all duration-200",
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        )}
      >
        <Bot className="h-6 w-6" />
      </Button>

      {/* AI Assistant Panel */}
      <div
        className={cn(
          "fixed bottom-6 right-6 w-96 transition-all duration-200",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        <Card className="h-[600px] flex flex-col shadow-xl">
          <CardHeader className="flex-none flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center">
              <Bot className="mr-2 h-5 w-5 text-primary" />
              AI Assistant
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-4">
            <div
              className="flex-1 mb-4 pr-4 overflow-y-auto"
              style={{ maxHeight: 400 }}
            >
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
    </>
  );
}
