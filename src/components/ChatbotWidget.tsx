"use client";

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { PortfolioData } from '@/lib/portfolio-types';
import { queryPortfolio, type PortfolioQueryInput } from '@/ai/flows/portfolio-query-flow';
import { useToast } from '@/hooks/use-toast';

interface ChatbotWidgetProps {
  portfolioData: PortfolioData;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
}

export function ChatbotWidget({ portfolioData }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaViewportRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const initialGreeting = "Hello! I'm Sunil's AI assistant. Ask me anything about his portfolio.";

  useEffect(() => {
    if (isOpen && messages.length === 0 && !isLoading) {
      setMessages([{ id: 'initial-greeting', sender: 'bot', text: initialGreeting }]);
    }
  }, [isOpen, messages.length, isLoading]);

  useEffect(() => {
    if (scrollAreaViewportRef.current) {
      scrollAreaViewportRef.current.scrollTo({ top: scrollAreaViewportRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (!isOpen && messages.length === 0 && !isLoading) {
         setMessages([{ id: 'initial-greeting', sender: 'bot', text: initialGreeting }]);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '' || isLoading) return;

    const userMessageText = inputValue.trim();
    const userMessage: Message = { id: Date.now().toString(), sender: 'user', text: userMessageText };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      if (!portfolioData) {
        throw new Error("Portfolio data is not available.");
      }
      const input: PortfolioQueryInput = {
        portfolioData,
        userQuery: userMessageText,
      };
      const response = await queryPortfolio(input);
      const botMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: response.chatbotResponse };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error querying portfolio:', error);
      const errorMessageText = error instanceof Error ? error.message : "Sorry, I encountered an error. Please try again.";
      const errorMessage: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: "Sorry, I couldn't get a response right now. Please try again later." };
      setMessages(prev => [...prev, errorMessage]);
      toast({
        title: "Chatbot Error",
        description: "Could not get a response from the AI. Please check your connection or ensure API key is correctly configured.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Slight delay to ensure input is re-enabled before focusing
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <Button
          onClick={toggleChat}
          className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 p-0 shadow-lg bg-primary hover:bg-accent text-primary-foreground"
          aria-label="Open chat"
        >
          <MessageSquare size={24} />
        </Button>
      )}

      {isOpen && (
        <Card className="fixed bottom-6 right-6 z-[60] w-[350px] h-[500px] shadow-xl flex flex-col bg-card border-border rounded-xl overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between p-4 border-b border-border bg-card">
            <CardTitle className="text-lg font-semibold text-primary">Portfolio Assistant</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleChat} className="text-muted-foreground hover:text-primary">
              <X size={20} />
              <span className="sr-only">Close chat</span>
            </Button>
          </CardHeader>
          <CardContent className="flex-grow p-0 overflow-hidden bg-background">
            <ScrollArea className="h-full" viewportRef={scrollAreaViewportRef}>
              <div className="p-4 space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-lg shadow-md text-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {msg.text.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                          {line}
                          {i < msg.text.split('\n').length - 1 && <br />}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] p-3 rounded-lg shadow bg-muted text-muted-foreground flex items-center">
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      <span>Thinking...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-3 border-t border-border bg-card">
            <div className="flex w-full items-center space-x-2">
              <Input
                ref={inputRef}
                type="text"
                placeholder="Ask a question..."
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                disabled={isLoading}
                className="flex-grow bg-background placeholder:text-muted-foreground"
                aria-label="Chat message input"
              />
              <Button type="submit" size="icon" onClick={handleSendMessage} disabled={isLoading || inputValue.trim() === ''} className="bg-primary hover:bg-accent text-primary-foreground">
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send size={20} />}
                <span className="sr-only">Send message</span>
              </Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </>
  );
}
