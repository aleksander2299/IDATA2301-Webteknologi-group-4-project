import '../../styles/main.css';
import './RegisterPage.css';

import { jwtDecode } from 'jwt-decode';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance';

import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.jsx';

function RegisterPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
      e.preventDefault();
  
      try {
        const response = await axiosInstance.post('/authenticate/register', {
          username,
          password,
          role,
        });
  
        const token = response.data.token;
        if (token) {
          const decodedToken = jwtDecode<any>(token);
          const role = decodedToken.role?.[0]?.authority;
  
          localStorage.setItem('token', token);
          localStorage.setItem('username',username);
          localStorage.setItem('password', password);
          if (role) {
            localStorage.setItem('role', role);
          }

          if(role == "ROLE_PROVIDER"){
            const provider = {
              providerName : localStorage.getItem("username") || ""
            }
            axiosInstance.post(`/providers`,provider,{
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
              }
            })
            .then((response) => {
              console.log("Provider posted successfully:", response.data);
              alert("Successful provider registration.")
            })
            .catch((error) => {
              console.error("Error posting provider:", error);
              alert("failure to post provider")
            });
          }

          // Navigates to home
          navigate('/');
          console.log(role + " here should be role non null")
          console.log(token + " jwt token here")
        }
      } catch (err) {
        console.error('Registration error:', err);
        alert('Failed to register. That username might already be taken.');
      }
    };

  return (
    <div>
      <Header />
      <main>
        <form className='form' onSubmit={handleRegister}>
          <div className="register">
            <h1 className="fRegister">Register</h1>
            <label htmlFor="rusername">Username:</label>
            <input
              type="text"
              id="rusername"
              name="rusername"
              placeholder="Choose a username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            /><br />
            <label htmlFor="rpass">Password:</label>
            <input
              type="password"
              id="rpass"
              name="rpass"
              placeholder="Choose a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            /><br />
            <label htmlFor="rusername">Role:</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required>
                <option value="">Select Role</option>
                <option value="USER">User</option>
                <option value="PROVIDER">Provider</option>
                {/*<option value="ADMIN">Admin</option> */}
              </select>
            <button className="submit" type="submit">Register</button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
}
  
  export default RegisterPage;
  










