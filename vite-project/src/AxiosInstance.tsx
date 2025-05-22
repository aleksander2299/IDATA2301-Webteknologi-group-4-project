import axios from 'axios';

export const axiosInstance = axios.create({
    baseURL: `http://localhost:8080/api`
});


{/* CHANGE THESE TO WHAT YOU WANT ABOVE */}

{/* LOCALHOST baseURL to run site locally: */}
{/* baseURL: `http://localhost:8080/api` */}

{/* DEPLOYMENT baseURL: */}
{/* baseURL: `/api `*/}