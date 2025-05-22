import { jwtDecode } from 'jwt-decode';
import loginPageStyle from './LoginPage.module.css';

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
                // Extract token
                const decodedToken = jwtDecode<any>(token);

                // Extract role
                const role = decodedToken.role?.[0]?.authority;

                console.log('Decoded JWT token:', decodedToken);
                console.log('Extracted role:', role);

                // Store token, username and role
                localStorage.setItem('token', token);
                localStorage.setItem('username', username);
                localStorage.setItem('password', password);
                if (role) {
                    localStorage.setItem('role', role);
                }

                // Navigates to home
                navigate('/');
                console.log(role + "here should be role non null")
                console.log(token + " jwt token here")
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
                <form className={loginPageStyle.form} onSubmit={handleLogin}>
                    <div className={loginPageStyle.login}>
                        <h1>Login</h1>
                        <label htmlFor="fusername">Username:</label>
                        <input
                            type="text"
                            id="fusername"
                            name="fusername"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        /><br />
                        <label htmlFor="lpass">Password:</label>
                        <input
                            type="password"
                            id="lpass"
                            name="lpass"
                            placeholder="Enter password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        /><br />
                        <a href="/register"><p className={loginPageStyle.rparagraph}>Not a user? Register here</p></a>
                        <button className={loginPageStyle.submit} type="submit">Login</button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}

export default LoginPage;