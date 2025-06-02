"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// Schema for the form, including name, title, and profileImage
const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  aboutMe: z.string().min(10, "About me must be at least 10 characters"),
  skills: z.string().transform(val => val.split(',').map(skill => skill.trim()).filter(skill => skill !== "")), // Comma-separated skills
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  profileImage: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: PortfolioData;
  onSave: (data: PortfolioData) => void;
}

export function EditProfileModal({ isOpen, onClose, profileData, onSave }: EditProfileModalProps) {
  const { control, handleSubmit, register, formState: { errors }, reset } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profileData.name || "",
      title: profileData.title || "",
      aboutMe: profileData.aboutMe,
      skills: profileData.skills.join(', '),
      email: profileData.contactInfo.email,
      phone: profileData.contactInfo.phone || "",
      profileImage: profileData.profileImage || "",
    },
  });

  useEffect(() => {
    if (profileData) {
      reset({
        name: profileData.name || "",
        title: profileData.title || "",
        aboutMe: profileData.aboutMe,
        skills: profileData.skills.join(', '),
        email: profileData.contactInfo.email,
        phone: profileData.contactInfo.phone || "",
        profileImage: profileData.profileImage || "",
      });
    }
  }, [profileData, reset, isOpen]);


  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    const updatedData: PortfolioData = {
      ...profileData, // Spread existing data to keep projects, etc.
      name: data.name,
      title: data.title,
      aboutMe: data.aboutMe,
      skills: data.skills,
      contactInfo: {
        email: data.email,
        phone: data.phone,
      },
      profileImage: data.profileImage,
    };
    onSave(updatedData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">Edit Profile</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" {...register("name")} className={errors.name ? 'border-destructive' : ''} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="title">Title/Headline</Label>
            <Input id="title" {...register("title")} className={errors.title ? 'border-destructive' : ''} />
            {errors.title && <p className="text-sm text-destructive mt-1">{errors.title.message}</p>}
          </div>
          <div>
            <Label htmlFor="aboutMe">About Me</Label>
            <Textarea id="aboutMe" {...register("aboutMe")} rows={5} className={errors.aboutMe ? 'border-destructive' : ''} />
            {errors.aboutMe && <p className="text-sm text-destructive mt-1">{errors.aboutMe.message}</p>}
          </div>
          <div>
            <Label htmlFor="skills">Skills (comma-separated)</Label>
            <Input id="skills" {...register("skills")} className={errors.skills ? 'border-destructive' : ''} />
            {errors.skills && <p className="text-sm text-destructive mt-1">{errors.skills.message}</p>}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" {...register("email")} className={errors.email ? 'border-destructive' : ''} />
            {errors.email && <p className="text-sm text-destructive mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div>
            <Label htmlFor="profileImage">Profile Image URL (Optional)</Label>
            <Input id="profileImage" {...register("profileImage")} placeholder="https://example.com/image.png" className={errors.profileImage ? 'border-destructive' : ''}/>
            {errors.profileImage && <p className="text-sm text-destructive mt-1">{errors.profileImage.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-accent text-primary-foreground">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
// Need to import useEffect from react
import { useEffect } from 'react';
