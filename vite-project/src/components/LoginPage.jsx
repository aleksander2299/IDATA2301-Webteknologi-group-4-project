import '../styles/loginstyle.css';

import { axiosInstance } from '../App';

import Footer from './Footer.jsx';
import Header from './Header.jsx';

function loginPage() {
    return (
        <div>
            <Header />
            <main>
                <form action="" method="post">
                    <div className="login">
                        <h1 className="fLogin">Login</h1>
                        <label htmlFor="fusername">Username:</label><br />
                        <input type="text" id="fusername" name="fusername" placeholder="enter username" /><br />
                        <label htmlFor="lpass">Password:</label><br />
                        <input type="text" id="lpass" name="lpass" placeholder="enter password" /><br />
                        <a href="register.html"><p className="rparagraph">Not a user? Register here</p></a>
                        <button className="submit" type="button" onClick={testCommunicationWithBackend}>Login</button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}



async function testCommunicationWithBackend(){
    try{
      const response = await axiosInstance.get('/api/providers')
      console.log("backend response from providers: ",response.data)
      alert("got backend data: ", JSON.stringify(response.data))
    }
    catch(err){
        console.error('Error communicating with backend:', err);
        alert("Failed to contact backend.");
    }
    
}




export default loginPage


