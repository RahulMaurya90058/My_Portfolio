import axios from "axios";

const API = axios.create({
  baseURL: "https://my-portfolio-x8i4.onrender.com/api",
  withCredentials: true,
});

export default API;