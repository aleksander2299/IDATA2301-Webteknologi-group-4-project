import '../styles/settings.css'


function Settings(){
return(

<div>
    <header>
        <div class="settings"><b>Settings</b></div>
    </header>
    <div class="settingscontainer">
    <section id="userDetails">
        <h2>user details:</h2>
        <label>Username:</label>
        <input type="text" value="username42" disabled />
        <label>Password:</label>
        <input type="password" value="password" id="password" />
        <button class="btn show-btn">show password</button>
    
    </section>
    <section id="changePassword" >
        <h2>change password ?</h2>
        <label>Change password:</label>
        <input type="password" value="password" disabled id="changepass" />
        <label>Confirm password:</label>
        <input type="password" value="password" id="confirmpass" />
        <button class="btn change-btn">change password</button>
    </section>
</div>

<div class="deleteButton">
    <button id="deletebtn">
        Delete Account
    </button>
</div>
</div>

);
}

export default Settings;

