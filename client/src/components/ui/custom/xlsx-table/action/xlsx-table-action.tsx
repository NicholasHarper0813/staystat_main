import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IXlsxTableActionProps {
  children: React.ReactNode;
  title: string;
  description: string;
  onDelete: () => void;
}

export default function XlsxTableAction({
  children,
  title,
  description,
  onDelete,
}: IXlsxTableActionProps) {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription className="mt-1  dark:text-accent-red-500 text-accent-red-950">
          {description}
        </DialogDescription>
        <DialogFooter className="mt-2">
          <Button onClick={onDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
