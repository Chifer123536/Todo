import axios from "axios";

export const api = axios.create({
  baseURL: process.env.SERVER_URL as string,
  timeout: 5000,
  withCredentials: true,
});
