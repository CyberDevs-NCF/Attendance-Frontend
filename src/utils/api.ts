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

// Save or update an attendance record for an event/student
export const saveAttendance = async (
  attendance: { event_id: string; student_id: string },
  timeField: "timeInAM" | "timeOutAM" | "timeInPM" | "timeOutPM"
) => {
  const res = await API.post(
    `/attendance?time=${encodeURIComponent(timeField)}`,
    attendance
  );
  return res.data;
};
