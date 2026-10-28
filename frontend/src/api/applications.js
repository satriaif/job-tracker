import axiosInstance from "./axiosInstance.js";

export const getApplicationsApi = async () => {
   const response = await axiosInstance.get("/applications");
   return response.data;
};

export const getApplicationApi = async (id) => {
   const response = await axiosInstance.get(`/applications/${id}`);
   return response.data;
};

export const createApplicationApi = async (data) => {
   const response = await axiosInstance.post("/applications", data);
   return response.data;
};

export const updateApplicationApi = async (id, data) => {
   const response = await axiosInstance.put(`/applications/${id}`, data);
   return response.data;
};

export const deleteApplicationApi = async (id) => {
   const response = await axiosInstance.delete(`/applications/${id}`);
   return response.data;
};
