import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import './SettingsPage.css';
import { Link, useNavigate } from 'react-router-dom';

import axios from 'axios';
import { useEffect, useState } from 'react';

function SettingsPage(){
    
const navigate = useNavigate();

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  navigate('/');
  window.location.reload();
};

interface user{
    username: string;
    password: string;
    role: string;
}



function deleteAccount(){
    const token = localStorage.getItem('token');
    let role = localStorage.getItem("role") || "";

    role = role.replace(/^ROLE_/, "");

    const user : user = {
        username : localStorage.getItem("username") || "",
        password : localStorage.getItem("password") || "",
        role : role,
    }

    console.log('Deleting user: ', user);  
    console.log(token + " TOKEN ")

    axios.delete(`http://localhost:8080/api/user`, {
    headers: {
            Authorization: `Bearer ${token}`,
          },
      data : user,
    })
    .then((response) =>{
        handleLogout();
        console.log("Account deleted:", response.data);
    })
    .catch((error) => {
        if (error.response) {
          // Server responded with a status outside 2xx
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          console.error("Response headers:", error.response.headers);
        } else if (error.request) {
          // Request was made but no response received
          console.error("Request made but no response:", error.request);
        } else {
          // Something else happened setting up the request
          console.error("Error message:", error.message);
        }
        console.error("Config:", error.config);
    });
}



    

    const [showPassword, setShowPassword] = useState(false);

    return(
        <div className = "settingsWrapper">
            <Header/>
            <div className="settingscontainer">
            <section id="userDetails">
                <h2 className="h2">user details:</h2>
                <label className="label">Username:</label>
                <input className="input" type="text" value={localStorage.getItem('username') || ""} readOnly disabled/>
                <label className="label">Password:</label>
                <input className="input" type={showPassword ? 'text' : 'password'} value={localStorage.getItem('password') || ""} readOnly id="password" disabled />
                <button type="button" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
            
            </section>
            <section id="changePassword" >
                <h2 className="h2">change password ?</h2>
                <label className="label">Change Password:</label>
                <input className="input" type="password" defaultValue="password" />
                <label className="label">Confirm Password:</label>
                <input className="input" type="password" value="password" id="confirmpass" />
                <button>Change Password</button>
            </section>

        </div>
        <div className="deleteButton">
            <button id="deletebtn" onClick={deleteAccount}> Delete Account </button>
            </div>
            <Footer/>
        </div>
    );
}

export default SettingsPage;

