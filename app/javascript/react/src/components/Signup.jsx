import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom/client';
import { TextField, Button, Box, Snackbar } from '@mui/material';
import LoginForm from './Login';

const SignupForm = () => {
  const url = "http://localhost:3000/users";
  const [csrfToken, setCsrfToken] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch CSRF token when component mounts
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${url}/sign_up`); 
        const data = await response.json();
        setCsrfToken(data.csrf_token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken, // Include CSRF token
        },
        body: JSON.stringify({ user: { email, password } }),
      });
      debugger
      const data = await response.json();
      if(response.ok){
       
       setSuccessMessage('You have successfully submitted the form.');
       setOpenSnackbar(true);
      }else{
        setErrorMessage(data.error || 'An error occurred.');
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('An error occurred.');
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box m={2}>
          <TextField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box m={2}>
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box m={2}>
          <TextField
            label="Password confirmation"
            type="password"
            value={password} // Should this be confirmPassword?
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box m={2}>
          <Button type="submit">Sign Up</Button>
        </Box>
      </form>
      <LoginForm />
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        message={successMessage || errorMessage}
      />
    </div>
  );
};
const root = ReactDOM.createRoot(document.getElementById('signup'));
root.render(<SignupForm />);

// document.addEventListener('DOMContentLoaded', () => {
//   ReactDOM.render(<SignupForm />, document.getElementById('signup'));
// });

export default SignupForm;
