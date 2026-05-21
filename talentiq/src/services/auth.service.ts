import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: {
  email: string;
  password: string;
}) => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await API.post("/auth/forgot-password", {
    email,
  });

  return response.data;
};