'use client';

import React, { useState } from "react";
import { Button } from "@components/ui/button";
import { Textarea } from "@components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { MessageSquare, SendHorizonal, PlusCircle } from "lucide-react";
import { toast } from "sonner";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  canAddToReport?: boolean;
}

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help with your investment report? Ask me for specific data or insights about this property.",
      isUser: false,
      timestamp: new Date(),
      canAddToReport: false,
    },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
      canAddToReport: false,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponses = [
        "I've added a rental market analysis for this area to your report. The average rental prices have increased by 4.2% in the last 12 months.",
        "Based on your request, I've included a section on potential renovation costs. For this property, a kitchen remodel would cost approximately £8,000-£12,000.",
        "I've updated your report with information about local schools and amenities, which can be a selling point for family rentals.",
        "I've added a comparison with similar properties in the area. Your potential ROI is 2% higher than the neighbourhood average.",
        "I've included a mortgage payment breakdown based on current interest rates for buy-to-let properties.",
      ];

      const responseIndex = Math.floor(Math.random() * aiResponses.length);
      const aiResponse = aiResponses[responseIndex];

      if (aiResponse) {
        const aiMessage: Message = {
          id: Date.now() + 1,
          text: aiResponse,
          isUser: false,
          timestamp: new Date(),
          canAddToReport: true,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        console.error("Invalid response index");
      }
    }, 1500);
  };

  const handleAddToReport = (messageId: number) => {
    // Find the message that needs to be added
    const messageToAdd = messages.find((message) => message.id === messageId);
    if (!messageToAdd) return;

    // In a real app, this would update the report data
    // For now, we'll just show a toast notification
    toast.success("Added to your investment report!");

    // Update the message to indicate it's been added to the report
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, canAddToReport: false } : msg
      )
    );
  };

  const handleAskAnother = () => {
    setInputValue("");
    // Focus on the textarea
    const textarea = document.querySelector("textarea");
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <>
      {/* Chat toggle button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 shadow-lg p-0 bg-propalytiq-blue hover:bg-propalytiq-blue/90"
        size="icon"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat box */}
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
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className="flex flex-col max-w-[80%]">
                    <div
                      className={`rounded-lg p-3 ${
                        message.isUser
                          ? "bg-propalytiq-blue text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                      <p className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>

                    {!message.isUser && message.canAddToReport && (
                      <div className="flex space-x-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs py-1 h-auto"
                          onClick={() => handleAddToReport(message.id)}
                        >
                          <PlusCircle className="h-3 w-3 mr-1" /> Add to Report
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
              ))}
            </div>

            <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
              <Textarea
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
};

export default ChatBox;
