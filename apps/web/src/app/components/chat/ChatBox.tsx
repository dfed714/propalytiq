"use client";

import * as React from "react";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { MessageSquare, SendHorizonal, PlusCircle } from "lucide-react";
import { toast } from "sonner";

export type ChatMessage = {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string; // ISO
  canAddToReport?: boolean;
};

type SendHandler = (text: string) => Promise<ChatMessage>;
type AddToReportHandler = (messageId: string) => Promise<void>;

export interface ChatBoxProps {
  /** Prefetched conversation (optional) */
  initialMessages?: ChatMessage[];
  /** Either provide an endpoint… */
  sendEndpoint?: string;
  addToReportEndpoint?: string;
  /** …or provide direct handlers (these take precedence if provided) */
  onSendMessage?: SendHandler;
  onAddToReport?: AddToReportHandler;
  /** Start open? */
  defaultOpen?: boolean;
}

export default function ChatBox({
  initialMessages = [],
  sendEndpoint,
  addToReportEndpoint,
  onSendMessage,
  onAddToReport,
  defaultOpen = false,
}: ChatBoxProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);
  const [inputValue, setInputValue] = React.useState("");
  const [messages, setMessages] =
    React.useState<ChatMessage[]>(initialMessages);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

  async function send(text: string) {
    if (onSendMessage) {
      return onSendMessage(text);
    }
    if (!sendEndpoint) {
      throw new Error("No send handler or endpoint provided.");
    }
    const res = await fetch(sendEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) throw new Error(`Send failed (${res.status})`);
    const json = (await res.json()) as { message: ChatMessage };
    if (!json?.message) throw new Error("Malformed send response.");
    return json.message;
  }

  async function addToReport(messageId: string) {
    if (onAddToReport) {
      await onAddToReport(messageId);
      return;
    }
    if (!addToReportEndpoint) {
      throw new Error("No add-to-report handler or endpoint provided.");
    }
    const res = await fetch(addToReportEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });
    if (!res.ok) throw new Error(`Add to report failed (${res.status})`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text) return;

    const optimistic: ChatMessage = {
      id: `local-${Date.now()}`,
      text,
      isUser: true,
      timestamp: new Date().toISOString(),
      canAddToReport: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setInputValue("");

    try {
      const reply = await send(text);
      setMessages((prev) => [...prev, reply]);
    } catch (err: any) {
      toast.error(err?.message ?? "Failed to send message");
    }
  }

  async function handleAddToReport(messageId: string) {
    try {
      await addToReport(messageId);
      toast.success("Added to your investment report!");
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId ? { ...m, canAddToReport: false } : m
        )
      );
    } catch (err: any) {
      toast.error(err?.message ?? "Could not add to report");
    }
  }

  function handleAskAnother() {
    setInputValue("");
    textareaRef.current?.focus();
  }

  return (
    <>
      {/* Toggle */}
      <Button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg p-0 bg-propalytiq-blue hover:bg-propalytiq-blue/90"
        size="icon"
        aria-label="Toggle chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Panel */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 sm:w-96 shadow-xl z-50 border border-gray-200">
          <CardHeader className="bg-propalytiq-blue text-white py-3 px-4">
            <CardTitle className="text-base font-medium flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Investment Assistant
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto p-4 space-y-4">
              {messages.map((m) => {
                const timeText = new Date(m.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
                return (
                  <div
                    key={m.id}
                    className={`flex ${
                      m.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div className="flex flex-col max-w-[80%]">
                      <div
                        className={`rounded-lg p-3 ${
                          m.isUser
                            ? "bg-propalytiq-blue text-white"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <p className="text-sm">{m.text}</p>
                        <p className="text-xs mt-1 opacity-70">{timeText}</p>
                      </div>

                      {!m.isUser && m.canAddToReport && (
                        <div className="flex space-x-2 mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs py-1 h-auto"
                            onClick={() => handleAddToReport(m.id)}
                          >
                            <PlusCircle className="h-3 w-3 mr-1" /> Add to
                            Report
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-xs py-1 h-auto"
                            onClick={handleAskAnother}
                          >
                            Ask Another
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
              <Textarea
                ref={textareaRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask for specific data or insights..."
                className="min-h-[80px] resize-none text-sm"
              />
              <Button
                type="submit"
                size="icon"
                className="h-10 w-10 rounded-full"
              >
                <SendHorizonal className="h-5 w-5" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </>
  );
}
