"use server";
import axiosInstance from "@/lib/axiosIntance";

export const chatBot = async (formData: FormData, id: number) => {
  try {
    const result = await axiosInstance.post(`groq/chat/${id}`, formData);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
