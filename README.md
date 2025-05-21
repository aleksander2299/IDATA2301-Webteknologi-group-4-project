# HOTEL WEBSITE GROUP 4 
Collaborators: Tobias, Aleksander, Daniel, Nikolai.

About this project : This is a project in courses IDATA2306 and IDATA2301 
we were tasked with creating a hotel site where you can log in as user and admin that have their own roles that has their own 
authorities, the project is to be secured with JWT authentication and the user of the project shall be able to book rooms,
search for rooms, change settings and login and logout etc. it is supposed to be a hotel room aggregator like trivago


## Tech Stack
- React 19
- TypeScript
- Vite 6
- React Router DOM (v7)
- Axios (HTTP client)
- React DatePicker
- JWT Decode (for token handling)
- ESLint (with React & Hooks plugins)

## prerequisites
- Node.js v18 or higher
- npm (comes with Node.js)

## Setup and Running

1. Install dependencies:
In terminal:
```
npm install
```
to run vite with npm preview or npm run dev you need to change directory to vite-project folder and then use npm install and then you can run those commands after.
This is done with command 
```
cd vite-project
```
in the terminal.

Then in terminal
```
npm run dev
```
then open your browser at http://localhost:5173, NB! it is required to have backend running for functionality

Important that this line 
```
export const axiosInstance = axios.create({
    baseURL : 'http://localhost:8080'
});
```
in App.tsx that sets the axios instance, stay like this since the group will change it from localhost:8080 to deployed url.

## site tips
There exists premade accounts for you to use, they are listed below:
 
user: dave, Password: Dangerous2024
admin: chuck, Password: Nunchucks2024
provider: norris, Password: Warrior2024


Pictures of website:
![image](https://github.com/user-attachments/assets/e8e7d352-ea6d-440d-bb33-9cdae2392e00),
![image](https://github.com/user-attachments/assets/62867bf2-8aa1-442e-aa9e-33fc36a57485)







