import axiosInstance from "./axiosInstance.js";

export const registerApi = async (data) => {
   const response = await axiosInstance.post("/auth/register", data);
   return response.data;
};

export const loginApi = async (data) => {
   const response = await axiosInstance.post("/auth/login", data);
   return response.data;
};
