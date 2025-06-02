"use client";

import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { PortfolioData } from '@/ai/flows/portfolio-chatbot';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useEffect } from 'react';

type Project = PortfolioData['projects'][number] & { image?: string, imageHint?: string };

const projectFormSchema = z.object({
  name: z.string().min(1, "Project name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  image: z.string().url("Must be a valid URL for image").optional().or(z.literal("")),
  imageHint: z.string().max(50, "Hint too long").optional(),
});

export type ProjectFormValues = z.infer<typeof projectFormSchema>;

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: Project | null; // Null for new project, object for editing
  onSave: (projectData: ProjectFormValues, originalName?: string) => void;
}

export function EditProjectModal({ isOpen, onClose, project, onSave }: EditProjectModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
  });

  useEffect(() => {
    if (project) {
      reset(project);
    } else {
      reset({ name: "", description: "", link: "", image: "", imageHint: "" });
    }
  }, [project, reset, isOpen]);

  const onSubmit: SubmitHandler<ProjectFormValues> = (data) => {
    onSave(data, project?.name);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-primary">{project ? "Edit Project" : "Add New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
          <div>
            <Label htmlFor="projectName">Project Name</Label>
            <Input id="projectName" {...register("name")} className={errors.name ? 'border-destructive' : ''} />
            {errors.name && <p className="text-sm text-destructive mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="projectDescription">Description</Label>
            <Textarea id="projectDescription" {...register("description")} rows={4} className={errors.description ? 'border-destructive' : ''} />
            {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <Label htmlFor="projectLink">Project Link (Optional)</Label>
            <Input id="projectLink" {...register("link")} placeholder="https://example.com/my-project" className={errors.link ? 'border-destructive' : ''}/>
            {errors.link && <p className="text-sm text-destructive mt-1">{errors.link.message}</p>}
          </div>
          <div>
            <Label htmlFor="projectImage">Image URL (Optional)</Label>
            <Input id="projectImage" {...register("image")} placeholder="https://example.com/project-image.png" className={errors.image ? 'border-destructive' : ''}/>
            {errors.image && <p className="text-sm text-destructive mt-1">{errors.image.message}</p>}
          </div>
           <div>
            <Label htmlFor="projectImageHint">Image AI Hint (Optional, 1-2 words for image search)</Label>
            <Input id="projectImageHint" {...register("imageHint")} placeholder="e.g. tech product" className={errors.imageHint ? 'border-destructive' : ''}/>
            {errors.imageHint && <p className="text-sm text-destructive mt-1">{errors.imageHint.message}</p>}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" className="bg-primary hover:bg-accent text-primary-foreground">
              {project ? "Save Changes" : "Add Project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
