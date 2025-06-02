
"use client";

import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';
import { extractResumeData, type ExtractedPortfolioData, type ExtractResumeDataInput } from '@/ai/flows/extract-resume-data-flow';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from 'react';
import { Loader2, FileText } from "lucide-react";

// Schema for the form, including name, title, and profileImage
const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().min(1, "Title is required"),
  aboutMe: z.string().min(10, "About me must be at least 10 characters"),
  skills: z.string().transform(val => val.split(',').map(skill => skill.trim()).filter(skill => skill !== "")), // Comma-separated skills
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  profileImage: z.string().url("Must be a valid URL or a relative path e.g. /image.png").or(z.string().startsWith("/", { message: "Must be a relative path starting with / or a valid URL"})).optional().or(z.literal("")),
  profileImageHint: z.string().max(50, "Hint too long").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: PortfolioData;
  onSave: (data: PortfolioData) => void;
}

export function EditProfileModal({ isOpen, onClose, profileData, onSave }: EditProfileModalProps) {
  const { control, handleSubmit, register, formState: { errors }, reset, setValue, getValues } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: profileData.name || "",
      title: profileData.title || "",
      aboutMe: profileData.aboutMe,
      skills: profileData.skills.join(', '),
      email: profileData.contactInfo.email,
      phone: profileData.contactInfo.phone || "",
      profileImage: profileData.profileImage || "",
      profileImageHint: profileData.profileImageHint || "",
    },
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) { // Reset form when modal opens or profileData changes
      reset({
        name: profileData.name || "",
        title: profileData.title || "",
        aboutMe: profileData.aboutMe,
        skills: profileData.skills.join(', '),
        email: profileData.contactInfo.email,
        phone: profileData.contactInfo.phone || "",
        profileImage: profileData.profileImage || "",
        profileImageHint: profileData.profileImageHint || "",
      });
      setSelectedFile(null); // Clear selected file when modal opens
    }
  }, [profileData, reset, isOpen]);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleExtractFromResume = async () => {
    if (!selectedFile) {
      toast({ title: "No File Selected", description: "Please select a resume file (.txt or .md) to extract data from.", variant: "destructive" });
      return;
    }

    setIsExtracting(true);
    toast({ title: "Processing Resume...", description: "Extracting information, please wait." });

    try {
      const resumeText = await selectedFile.text();
      const input: ExtractResumeDataInput = { resumeText };
      const extractedData: ExtractedPortfolioData = await extractResumeData(input);

      // Merge extracted data into form fields, giving precedence to non-empty extracted values
      if (extractedData.name) setValue("name", extractedData.name);
      if (extractedData.title) setValue("title", extractedData.title);
      if (extractedData.aboutMe) setValue("aboutMe", extractedData.aboutMe);
      if (extractedData.skills && extractedData.skills.length > 0) setValue("skills", extractedData.skills.join(', '));
      
      if (extractedData.contactInfo) {
        if (extractedData.contactInfo.email) setValue("email", extractedData.contactInfo.email);
        if (extractedData.contactInfo.phone) setValue("phone", extractedData.contactInfo.phone);
      }
      
      toast({ title: "Data Extracted", description: "Resume data has been pre-filled. Please review and save." });

      // Note: Projects are not directly set in this form, but extracted data could be used to pre-fill Add/Edit Project modal.
      // For now, we'll log them or the user can copy-paste.
      if (extractedData.projects && extractedData.projects.length > 0) {
        console.log("Extracted projects:", extractedData.projects);
        toast({ title: "Projects Found", description: `${extractedData.projects.length} project(s)/experience(s) found in resume. You can add them manually using the "Add Project" button on the main page.`, duration: 7000 });
      }

    } catch (error) {
      console.error("Error extracting from resume:", error);
      toast({ title: "Extraction Failed", description: "Could not extract data from the resume. Please try again or fill manually.", variant: "destructive" });
    } finally {
      setIsExtracting(false);
    }
  };


  const onSubmit: SubmitHandler<ProfileFormValues> = (data) => {
    const updatedData: PortfolioData = {
      ...profileData, // Keep existing projects, profileImage etc. unless directly edited
      name: data.name,
      title: data.title,
      aboutMe: data.aboutMe,
      skills: data.skills, // skills are already transformed to array by Zod
      contactInfo: {
        email: data.email,
        phone: data.phone,
      },
      profileImage: data.profileImage,
      profileImageHint: data.profileImageHint,
      // projects are managed separately via page.tsx
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

        <div className="space-y-3 py-3">
          <Label htmlFor="resumeFile">Upload Resume (Optional, .txt or .md)</Label>
          <div className="flex items-center gap-2">
            <Input 
              id="resumeFile" 
              type="file" 
              accept=".txt,.md,text/plain,text/markdown" 
              onChange={handleFileChange} 
              className="flex-grow"
              disabled={isExtracting}
            />
            <Button 
              onClick={handleExtractFromResume} 
              disabled={!selectedFile || isExtracting}
              variant="outline"
              size="sm"
            >
              {isExtracting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
              Extract Data
            </Button>
          </div>
          {selectedFile && <p className="text-xs text-muted-foreground">Selected: {selectedFile.name}</p>}
          <p className="text-xs text-muted-foreground">Upload a plain text or Markdown resume to automatically fill some fields.</p>
        </div>
        <Separator className="my-4" />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <Label htmlFor="profileImage">Profile Image URL or Path (Optional)</Label>
            <Input id="profileImage" {...register("profileImage")} placeholder="https://example.com/image.png or /my_image.jpg" className={errors.profileImage ? 'border-destructive' : ''}/>
            {errors.profileImage && <p className="text-sm text-destructive mt-1">{errors.profileImage.message}</p>}
          </div>
           <div>
            <Label htmlFor="profileImageHint">Profile Image AI Hint (Optional, 1-2 words)</Label>
            <Input id="profileImageHint" {...register("profileImageHint")} placeholder="e.g. professional headshot" className={errors.profileImageHint ? 'border-destructive' : ''}/>
            {errors.profileImageHint && <p className="text-sm text-destructive mt-1">{errors.profileImageHint.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" onClick={() => { setSelectedFile(null); onClose();}}>Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-accent text-primary-foreground" disabled={isExtracting}>Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
