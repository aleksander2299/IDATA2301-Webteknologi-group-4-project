import '../styles/registerstyle.css';


function Register() {
    return (
      <div>
        <header>
          <div className="home"><b>Home</b></div>
        </header>
        <main>
          <form action="" method="post">
            <div className="register">
              <h1 className="fRegister">Register</h1>
              <label htmlFor="fusername">Username:</label><br />
              <input type="text" id="fusername" name="fusername" placeholder="enter username you want" /><br />
              <label htmlFor="lpass">Password:</label><br />
              <input type="text" id="lpass" name="lpass" placeholder="enter password you want" /><br />
              <label htmlFor="cpass">Confirm password:</label><br />
              <input type="text" name="cpass" id="cpass" placeholder="confirm password" />
              <button className="submit" type="submit">Register</button>
            </div>
          </form>
        </main>
      </div>
    );
  }
  
  export default Register;
  










