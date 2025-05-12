import './SettingsPage.css';


function SettingsPage(){
return(

<div>
    <header>
        <div className="settings"><b>Settings</b></div>
    </header>
    <div className="settingscontainer">
    <section id="userDetails">
        <h2>user details:</h2>
        <label>Username:</label>
        <input type="text" value="username42" disabled />
        <label>Password:</label>
        <input type="password" value="password" id="password" />
        <button className="btn show-btn">show password</button>
    
    </section>
    <section id="changePassword" >
        <h2>change password ?</h2>
        <label>Change password:</label>
        <input type="password" value="password" disabled id="changepass" />
        <label>Confirm password:</label>
        <input type="password" value="password" id="confirmpass" />
        <button className="btn change-btn">change password</button>
    </section>
</div>

<div className="deleteButton">
    <button id="deletebtn">
        Delete Account
    </button>
</div>
</div>

);
}

export default SettingsPage;

