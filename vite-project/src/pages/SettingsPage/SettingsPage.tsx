import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';
import './SettingsPage.css';

import { useState } from 'react';

function SettingsPage(){

    const [showPassword, setShowPassword] = useState(false);

    return(
        <div className = "settingsWrapper">
            <Header/>
            <div className="settingscontainer">
            <section id="userDetails">
                <h2 className="h2">user details:</h2>
                <label className="label">Username:</label>
                <input className="input" type="text" defaultValue="username123"/>
                <label className="label">Password:</label>
                <input className="input" type={showPassword ? 'text' : 'password'} value="password" id="password" />
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
            <button id="deletebtn"> Delete Account </button>
            </div>
            <Footer/>
        </div>
    );
}

export default SettingsPage;

