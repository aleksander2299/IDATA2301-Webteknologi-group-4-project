import { jwtDecode } from 'jwt-decode';
import './LoginPage.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../AxiosInstance.js';

import Footer from '../../components/layout/Footer.jsx';
import Header from '../../components/layout/Header.jsx';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Sends login credentials to the backend using the axiosInstance file
            const response = await axiosInstance.post('/authenticate/login', {
                username,
                password,
            });

            const token = response.data.token;

            if (token) {
                // Decodes the token to get user data
                const decodedToken = jwtDecode<any>(token);
                console.log('Decoded JWT token:', decodedToken);
                
                // Store token
                localStorage.setItem('token', token);

                // Navigates to home
                navigate('/');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Failed to login. Please check your credentials.');
        }
    };

    return (
        <div>
            <Header />
            <main>
                <form onSubmit={handleLogin}>
                    <div className="login">
                        <h1 className="fLogin">Login</h1>
                        <label htmlFor="fusername">Username:</label><br />
                        <input
                            type="text"
                            id="fusername"
                            name="fusername"
                            placeholder="enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        /><br />
                        <label htmlFor="lpass">Password:</label><br />
                        <input
                            type="password"
                            id="lpass"
                            name="lpass"
                            placeholder="enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        /><br />
                        <a href="/register"><p className="rparagraph">Not a user? Register here</p></a>
                        <button className="submit" type="submit">Login</button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default LoginPage;