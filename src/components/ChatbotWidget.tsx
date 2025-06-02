"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bot, User, CornerDownLeft, X, MessageSquare, Loader2 } from 'lucide-react';
import { portfolioChatbot, type PortfolioData, type PortfolioChatbotInput } from '@/ai/flows/portfolio-chatbot';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

interface ChatbotWidgetProps {
  portfolioData: PortfolioData;
}

export function ChatbotWidget({ portfolioData }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollViewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
      if (scrollViewport) {
        scrollViewport.scrollTop = scrollViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  useEffect(() => {
    if (isOpen && messages.length === 0) {
        setMessages([{ id: Date.now().toString(), sender: 'bot', text: "Hello! How can I help you with this portfolio?" }]);
    }
  }, [isOpen, messages.length]);


  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const chatbotInput: PortfolioChatbotInput = {
        query: userMessage.text,
        portfolioData: portfolioData,
      };
      const response = await portfolioChatbot(chatbotInput);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.response,
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Sorry, I encountered an error. Please try again later.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-primary hover:bg-accent text-primary-foreground shadow-lg z-50 transition-transform duration-300 ease-in-out transform hover:scale-110"
        aria-label="Toggle Chatbot"
      >
        {isOpen ? <X size={28} /> : <MessageSquare size={28} />}
      </Button>

      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-full max-w-sm h-[calc(100vh-12rem)] max-h-[600px] bg-card shadow-xl rounded-lg z-50 flex flex-col animate-slide-in-from-bottom">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b">
            <CardTitle className="text-lg font-semibold text-card-foreground flex items-center">
              <Bot className="mr-2 h-6 w-6 text-primary" /> AI Portfolio Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} aria-label="Close chat">
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden">
            <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${
                      msg.sender === 'user' ? 'justify-end' : ''
                    }`}
                  >
                    {msg.sender === 'bot' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[75%] rounded-lg px-3 py-2 text-sm shadow ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-none'
                          : 'bg-muted text-muted-foreground rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.sender === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-accent text-accent-foreground"><User size={18} /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-end gap-2">
                    <Avatar className="h-8 w-8">
                       <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18} /></AvatarFallback>
                    </Avatar>
                    <div className="max-w-[75%] rounded-lg px-3 py-2 text-sm shadow bg-muted text-muted-foreground rounded-bl-none flex items-center">
                       <Loader2 className="h-4 w-4 animate-spin mr-2" /> Typing...
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-4 border-t">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex w-full items-center gap-2"
            >
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about the portfolio..."
                className="flex-grow"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || inputValue.trim() === ''} className="bg-primary hover:bg-accent">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <CornerDownLeft className="h-5 w-5" />}
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
