import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
});


{/* CHANGE THESE TO WHAT YOU WANT ABOVE */}

{/* LOCALHOST baseURL to run site locally: */}
{/* baseURL: `http://localhost:8080/api` */}

{/* DEPLOYMENT baseURL: */}
{/* baseURL: `/api `*/}