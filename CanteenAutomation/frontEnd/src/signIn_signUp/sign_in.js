//importing css
import '../App.css';

//importing MUI cmp
import { TextField, Typography, Container } from '@mui/material/';
import { ThemeProvider } from '@mui/material/';
import Button from '@mui/material/Button';

//importing photos
import login_photo from './login_photo.png'

//importing react cmp
import { NavLink, Navigate } from 'react-router-dom';
import { useState } from 'react';

//importing custom cmp
import theme from '../general_compo/theme.js'
import useReSize from './mediaQuery';


function SignIn() {
  //custom hook for media query
  const [background_style_ext, signIn_style_ext] = useReSize()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState("Customer")
  const [isSignupSuccessful, setIsSignupSuccessful] = useState(0);

  const handleChange = (event) => {
    if (event.target.id === "Email") {
      setEmail(event.target.value)
      const daEmailRegex = /@daiict\.ac\.in$/i;
      if (!daEmailRegex.test(event.target.value)) {
        setType("Canteen")
      }
      else {
        setType("Customer")
      }
    }
    else if (event.target.id === "Password") {
      setPassword(event.target.value)
    }
  }


  const apiUrl = 'http://localhost:8000/login';

  //submitting data to backend
  const handleButtonClick = () => {
    console.log(email, password)
    //const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%^&+=!])([A-Za-z\d@#$%^&+=!]{8,12})$/;
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (
      !emailRegex.test(email)
    ) {
      alert("Invalid Email")
      return
    }
    // if (
    //   password.length < 8 ||
    //   password.length > 12 ||
    //   !passwordRegex.test(password)
    // ) {
    //   alert('Password must be between 8 and 12 characters and contain only alphanumeric characters and one special character.');
    //   return 
    // }

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: `${email}`, password: `${password}` }),
    })
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          alert("You don't have an account/ wrong credentials");
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        // Store the token in local storage or a cookie for later use.

        localStorage.setItem('token', JSON.stringify(data));
        if (email === "padma_kamal@gmail.com") setIsSignupSuccessful(2)
        else if (type === "Customer") setIsSignupSuccessful(1)
        else setIsSignupSuccessful(0)
      })
      .catch(error => console.error('Error:', error));
  }

  return (
    <ThemeProvider theme={theme}>
      {/* background */}
      <Container className="App" maxWidth='xl' sx={{ backgroundImage: `url(${login_photo})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'center', ...background_style_ext }}>
        {isSignupSuccessful === 0 && <Navigate to="/" />}
        {isSignupSuccessful === 1 && <Navigate to="/home" />}
        {isSignupSuccessful === 2 && <Navigate to="/cownerHome/1" />}
        {/* sign-in box */}
        <Container className='signIn' sx={{ background: "rgba(222,216,216,0.5)", borderRadius: '30px', ...signIn_style_ext }}>
          <Typography sx={{ fontWeight: 'bolder', fontSize: '31px', marginTop: '31px' }}>Sign In</Typography>
          <TextField id="Email" label="Email" value={email} onChange={handleChange} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '30px', marginTop: '35px' }} />
          <TextField id="Password" label="Password" value={password} onChange={handleChange} variant="outlined" sx={{ background: "rgba(250,249,246,0.1)", borderRadius: "5px", marginBottom: '10px' }} />
          <Typography sx={{ marginLeft: '-80px' }}>Forgot Password?</Typography>
          <Button variant="contained" onClick={handleButtonClick} sx={{ fontWeight: "bolder", width: '220px', height: '50px', fontSize: '20px', textTransform: 'none', marginBottom: '30px', marginTop: '50px' }} disableElevation>Login</Button>
          <NavLink to='/sign_up' style={{ textDecoration: 'none', color: 'black' }}>
            <Container sx={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
              <Typography>Don't have an account?</Typography><Typography color='primary' >Sign up</Typography>
            </Container>
          </NavLink>
        </Container>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;