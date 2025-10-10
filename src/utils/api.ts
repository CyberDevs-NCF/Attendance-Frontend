import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;

// Fetch a single event by id
export const getEventById = async (id: string | number) => {
  const res = await API.get(`/events/${id}`);
  return res.data;
};
