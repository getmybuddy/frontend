import React, { Dispatch, SetStateAction } from "react";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";

const Alert = ({
  title,
  message,
  isOpen,
  setIsOpen,
}: {
  title: string;
  message: string;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent className="w-fit">
        <AlertDialogHeader>
          <VisuallyHidden.Root>
            <AlertDialogTitle></AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </VisuallyHidden.Root>
          <h2 className="font-bold text-center">{title}</h2>
          <p className="text-center">{message}</p>
        </AlertDialogHeader>
        <AlertDialogFooter className="!justify-center">
          <Button onClick={() => setIsOpen(false)}>OK</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default Alert;
