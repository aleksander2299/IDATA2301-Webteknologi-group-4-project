import './styles/loginstyle.css';



function loginPage() {
    return (
        <div>
            <header>
                <div className="home"><b>Home</b></div>
            </header>
            <main>
                <form action="" method="post">
                    <div className="login">
                        <h1 className="fLogin">Login</h1>
                        <label htmlFor="fusername">Username:</label><br />
                        <input type="text" id="fusername" name="fusername" placeholder="enter username" /><br />
                        <label htmlFor="lpass">Password:</label><br />
                        <input type="text" id="lpass" name="lpass" placeholder="enter password" /><br />
                        <a href="register.html"><p className="rparagraph">Not a user? Register here</p></a>
                        <button className="submit" type="submit">Login</button>
                    </div>
                </form>
            </main>
        </div>
    );
}

export default loginPage


