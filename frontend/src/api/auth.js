import axiosInstance from "./axiosInstance.js";

export const registerApi = async (data) => {
   const response = await axiosInstance.post("/auth/register", data);
   return response.data;
};

export const loginApi = async (data) => {
   const response = await axiosInstance.post("/auth/login", data);
   return response.data;
};

export const updateProfileApi = async (data) => {
   const response = await axiosInstance.put("/auth/profile", data);
   return response.data;
};

export const changePasswordApi = async (data) => {
   const response = await axiosInstance.put("/auth/password", data);
   return response.data;
};
