import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Send, Bot, User, FolderSync } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  profileDetected?: string;
  packageData?: any;
  timestamp: Date;
}

interface ChatResponse {
  message: string;
  profileDetected?: string;
  packageData?: any;
  conversationId: string;
}

export default function AiChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "Hi! I'm your Brazil transformation consultant. What draws you to Brazil? 🇧🇷",
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [conversationId, setConversationId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string): Promise<ChatResponse> => {
      const response = await apiRequest("POST", "/api/chat/message", {
        message,
        conversationId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setConversationId(data.conversationId);
      
      const aiMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: data.message,
        profileDetected: data.profileDetected,
        packageData: data.packageData,
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, aiMessage]);
    },
    onError: () => {
      toast({
        title: "Connection Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(inputMessage.trim());
    setInputMessage("");
  };

  const handleBookingInterest = (packageData: any) => {
    const message = "Yes, I'm interested in this package!";
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    chatMutation.mutate(message);
  };

  return (
    <Card className="w-full max-w-lg mx-auto shadow-2xl">
      {/* Chat Header */}
      <CardHeader className="bg-gradient-amazon-ocean p-4 text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <Bot className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold">Brazil Travel Consultant</h3>
            <p className="text-xs text-gray-200">AI-Powered • Online Now</p>
          </div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        </div>
      </CardHeader>

      {/* Chat Messages */}
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto bg-gray-50 custom-scrollbar">
          <div className="p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className="chat-message">
                {message.type === "ai" ? (
                  <div className="flex space-x-3">
                    <div className="w-8 h-8 bg-gradient-amazon-ocean rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                    <div className="max-w-xs">
                      {message.profileDetected && (
                        <Badge variant="outline" className="text-amazon border-amazon mb-2 text-xs">
                          {message.profileDetected} Profile Detected 🎭
                        </Badge>
                      )}
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <p className="text-sm">{message.content}</p>
                      </div>
                      {message.packageData && (
                        <div className="bg-white p-4 rounded-lg shadow-sm mt-2 max-w-sm">
                          <Badge variant="outline" className="text-green-600 border-green-600 mb-2 text-xs">
                            📦 Package Created
                          </Badge>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>✈️ Flights</span>
                              <span className="font-semibold">${message.packageData.flightPrice || 750}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🏨 Hotel (7 nights)</span>
                              <span className="font-semibold">${message.packageData.hotelPrice || 980}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🎭 Cultural Experiences</span>
                              <span className="font-semibold">${message.packageData.experiencePrice || 600}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>🚗 Transfers</span>
                              <span className="font-semibold">${message.packageData.transferPrice || 120}</span>
                            </div>
                            <Separator className="my-2" />
                            <div className="flex justify-between font-bold text-amazon">
                              <span>Total</span>
                              <span>${message.packageData.totalPrice || 2450}</span>
                            </div>
                            <div className="text-xs text-green-600">
                              You save ${message.packageData.savings || 350}! 💰
                            </div>
                          </div>
                          <Button
                            size="sm"
                            className="w-full mt-3 bg-amazon hover:bg-green-700 text-sm"
                            onClick={() => handleBookingInterest(message.packageData)}
                          >
                            Reserve This Package
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-3 justify-end">
                    <div className="bg-amazon text-white p-3 rounded-lg shadow-sm max-w-xs">
                      <p className="text-sm">{message.content}</p>
                    </div>
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="h-4 w-4 text-gray-600" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {chatMutation.isPending && (
              <div className="flex space-x-3">
                <div className="w-8 h-8 bg-gradient-amazon-ocean rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm max-w-xs">
                  <div className="flex items-center space-x-2 text-xs text-ocean">
                    <FolderSync className="h-3 w-3 animate-spin" />
                    <span>Checking real-time availability...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-4 border-t bg-white rounded-b-lg">
          <form onSubmit={handleSendMessage} className="flex space-x-3">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1"
              disabled={chatMutation.isPending}
            />
            <Button
              type="submit"
              size="sm"
              className="bg-amazon hover:bg-green-700"
              disabled={chatMutation.isPending || !inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="text-xs text-gray-500 mt-2">
            Powered by AI • Real-time travel data • Instant booking
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
