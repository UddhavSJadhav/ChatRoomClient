import axios from "axios";

const API = "http://localhost:5000/api/v1";

export const axiosNew = axios.create({
  baseURL: API,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: API,
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});
