import axios from "axios";

import { API } from "./API.js";

export const axiosNew = axios.create({
  baseURL: API + "/api/v1",
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: API + "/api/v1",
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});
