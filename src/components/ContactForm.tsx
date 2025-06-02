"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Send } from "lucide-react";

const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters long"),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit: SubmitHandler<ContactFormValues> = async (data) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Contact form submitted:", data);
    toast({
      title: "Message Sent!",
      description: "Thanks for reaching out. I'll get back to you soon.",
    });
    reset();
  };

  return (
    <section id="contact" className="py-16 sm:py-24 bg-muted">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
           <h2 className="text-4xl font-headline font-bold text-primary mb-4 flex items-center justify-center gap-3">
            <Mail className="w-10 h-10" /> Get In Touch
          </h2>
          <p className="text-lg text-foreground max-w-xl mx-auto">
            Have a question or want to work together? Fill out the form below.
          </p>
        </div>
        <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label htmlFor="name" className="text-card-foreground">Your Name</Label>
              <Input
                id="name"
                type="text"
                {...register("name")}
                className={`mt-1 ${errors.name ? 'border-destructive' : ''}`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <Label htmlFor="email" className="text-card-foreground">Your Email</Label>
              <Input
                id="email"
                type="email"
                {...register("email")}
                className={`mt-1 ${errors.email ? 'border-destructive' : ''}`}
                placeholder="you@example.com"
              />
              {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <Label htmlFor="message" className="text-card-foreground">Message</Label>
              <Textarea
                id="message"
                {...register("message")}
                rows={5}
                className={`mt-1 ${errors.message ? 'border-destructive' : ''}`}
                placeholder="Your message here..."
              />
              {errors.message && <p className="text-sm text-destructive mt-1">{errors.message.message}</p>}
            </div>

            <Button type="submit" disabled={isSubmitting} className="w-full bg-primary hover:bg-accent text-primary-foreground hover:text-accent-foreground transition-colors duration-300 py-3 text-lg">
              {isSubmitting ? "Sending..." : <>Send Message <Send className="ml-2 h-5 w-5"/></>}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
