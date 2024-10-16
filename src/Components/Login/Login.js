import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../Firebase/FirebaseConfig';
import { useAuth } from '../Context/AuthContext';
import logo from '../Img/Company_logo.png';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    // Check if the entered email and password are correct
    if (email !== 'admin@gmail.com' || password !== 'admin@123') {
      setError('Invalid email or password. Please try again.');
      setIsSubmitting(false);
      return;
    }
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Fetch additional user data from Firestore
      const userDoc = await db.collection('users').doc(user.uid).get();
      const userData = userDoc.data();
  
      // Ensure name is part of the user object
      login({
        uid: user.uid,
        email: user.email,
        name: userData?.name || 'Guest', // Default to 'Guest' if name is not available
        // Add any other user data you need
      });
  
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  

  const canSubmit = email.trim() !== '' && password.trim() !== '';

  return (
    <div className="d-flex justify-content-center align-items-center mt-5 pt-5">
      <div className="card" style={{ width: '36rem' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <img src={logo} alt="Logo" className="mb-3" style={{ width: '250px', height: '100px' }} />
            <h3>Login</h3>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label htmlFor="email" style={{ fontWeight: 'bold' }}>Email</label>
              <input
                type="email"
                className="form-control mt-1"
                id="email"
                placeholder="Enter Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3 position-relative">
              <label htmlFor="password" style={{ fontWeight: 'bold' }}>Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control mt-1"
                id="password"
                placeholder="Enter Your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                onClick={togglePasswordVisibility}
                className="position-absolute"
                style={{ right: '10px', top: '37px', cursor: 'pointer' }}
              />
            </div>
            {error && <div className="text-danger text-center">{error}</div>}
            <div className="text-center">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </div>
            {/* <div className="text-center">
            <p>
              Don't have an account?
              <a
                onClick={() => navigate('/signUp')}
                style={{ textDecoration: 'none', color: '#007bff', cursor: 'pointer', padding: '0', }}
              >
               &nbsp;Register
              </a>
              &nbsp;here
            </p>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
