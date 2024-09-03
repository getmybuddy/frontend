"use server";
import axiosInstance from "@/lib/axiosIntance";
import { revalidatePath } from "next/cache";

export const getFriends = async () => {
  try {
    const result = await axiosInstance.get(`friends`);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};

export const createFriend = async (formData: any) => {
  try {
    const result = await axiosInstance.post(`friends/create`, formData);
    revalidatePath("/chat");
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
