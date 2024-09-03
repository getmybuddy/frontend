"use server";
import axiosInstance from "@/lib/axiosIntance";

export const userLogin = async (payload: {
  identifier: string;
  password: string;
}) => {
  const result = await axiosInstance.post(`auth/login`, payload);
  return result;
};

export const userRegister = async (payload: {
  email: string;
  password: string;
  username: string;
}) => {
  try {
    const result = await axiosInstance.post(`users`, payload);
    return result.data;
  } catch (error) {
    console.log(error);
  }
};
