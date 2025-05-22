import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import settingsPageStyle from './SettingsPage.module.css';

import { useState } from 'react';
import { axiosInstance } from '../../AxiosInstance.js';

/**
 *  creates the settings page from data. 
*/ 
function SettingsPage(){
    

const [newPassword, setNewPassword] = useState('');
const [confirmPassword, setConfirmPassword] = useState('');    
const navigate = useNavigate();

/**
* handles logout navigates to homepage and removes your login. 
*/ 
const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  navigate('/');
  window.location.reload();
};

/**
* interface of user data. 
*/ 
interface user{
    username: string;
    password: string;
    role: string;
}

/**
* changes password for a user. 
*/ 
function changePassword(){
    const token = localStorage.getItem("token")

    if(newPassword.match(confirmPassword) != null)
    {
        const user = {
            username : localStorage.getItem("username") || "",
            password : newPassword,
            role : (localStorage.getItem("role") || "").replace(/^ROLE_/, ""),
        }

            axiosInstance.put(`/user/${user.username}`, user, {
                headers: {
                  Authorization: `Bearer ${token}`
                }
            })
            .then((response) => {
                alert("Password changed successfully.");
                localStorage.setItem("password", newPassword);
            })
            .catch((err) => {
                alert("password not changed")
                console.error(err)
            })

}
else{
    console.log("no password match")
}
}


/**
* deletes account from database and logs you out.
*/ 
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

    axiosInstance.delete(`/user`, {
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

    /**
    *   creates the structure for the settings page. 
    */ 
    return(
        <div className ={settingsPageStyle.settingsWrapper}>
            <Header/>
            <div className={settingsPageStyle.settingscontainer}>
            <section className={settingsPageStyle.userDetails}>
                <h2>user details:</h2>
                <label>Username:</label>
                <input type="text" value={localStorage.getItem('username') || ""} readOnly disabled/>
                <label>Password:</label>
                <input type={showPassword ? 'text' : 'password'} value={localStorage.getItem('password') || ""} readOnly id="password" disabled />
                <button type="button" onClick={() => setShowPassword(prev => !prev)}>
                {showPassword ? 'Hide Password' : 'Show Password'}
                </button>
            
            </section>
            <section className={settingsPageStyle.changePassword} >
                <h2>change password ?</h2>
                <label>Change Password:</label>
                <input type="password" placeholder="Input new password here" value={newPassword} onChange={(ev) => setNewPassword(ev.target.value)} />
                <label>Confirm Password:</label>
                <input type="password" placeholder="Confirm password here" value={newPassword} id="confirmpass" onChange={(e) => setConfirmPassword(e.target.value)} />
                <button onClick={changePassword}>Change Password</button>
            </section>

        </div>
        <div className={settingsPageStyle.deleteButton}>
            <button className={settingsPageStyle.deletebtn} onClick={deleteAccount}> Delete Account </button>
            </div>
            <Footer/>
        </div>
    );
}

export default SettingsPage;



