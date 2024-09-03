"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { createFriend } from "@/services/friends";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { revalidatePath } from "next/cache";
import Alert from "./Alert";

const AddFriend = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const formSchema = z.object({
    name: z.string().min(4, {
      message: "Username must be at least 6 characters.",
    }),
    age: z.coerce.number(),
    gender: z.enum(["Male", "Female"], {
      message: "MALE or FEMALE",
    }),
    occupation: z.string().min(6, {
      message: "occupation must be at least 6 characters.",
    }),
    location: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
    personalities: z.string().array().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    interests: z.string().array().min(1, {
      message: "Username must be at least 2 characters.",
    }),
    shortBio: z.string().min(2, {
      message: "Username must be at least 2 characters.",
    }),
  });
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 20,
      gender: "Male",
      occupation: "",
      location: "",
      personalities: [],
      interests: [],
      shortBio: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const result = await createFriend(values);
    if (result?.statusCode === 201) {
      setIsOpen(true);
      form.reset();
    } else {
      console.log("Add friend failed");
    }
  }

  return (
    <Dialog>
      <Alert
        title="Add Friend Successful!"
        message="Lets start a conversation."
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add friend</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 overflow-y-auto h-[30rem] pr-2"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="age"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Age</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="Enter age" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select {...field}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your gender..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="occupation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Occupation</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter occupation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="personalities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Personalities</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter personalities separated by commas"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value.split(",").map((tag) => tag)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="interests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interests</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter interests separated by commas"
                      value={field.value}
                      onChange={(e) => {
                        field.onChange(
                          e.target.value.split(",").map((tag) => tag)
                        );
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter location" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shortBio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Bio</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter bio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriend;
