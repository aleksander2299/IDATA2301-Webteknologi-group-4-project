import './SettingsPage.css';
import Footer from '../../components/layout/Footer.tsx';
import Header from '../../components/layout/Header.tsx';

function SettingsPage(){
return(

    

<div className = "settingsWrapper">
    <Header/>
    <div className="settingscontainer">
    <section id="userDetails">
        <h2 className='h2'>user details:</h2>
        <label>Username:</label>
        <input type="text" value="username42" disabled />
        <label>Password:</label>
        <input type="password" value="password" id="password" />
        <button>show password</button>
    
    </section>
    <section id="changePassword" >
        <h2 className='h2'>change password ?</h2>
        <label>Change password:</label>
        <input type="password" value="password" disabled id="changepass" />
        <label>Confirm password:</label>
        <input type="password" value="password" id="confirmpass" />
        <button>change password</button>
    </section>

</div>
<div className="deleteButton">
    <button id="deletebtn">
        Delete Account
    </button>
    </div>
    <Footer/>
</div>



);
}

export default SettingsPage;

