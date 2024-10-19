import React, { useEffect, useState } from 'react';
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

  // Function to extract query parameters from the URL
  const getQueryParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      email: params.get('email') || '',
      password: params.get('password') || ''
    };
  };

  // Auto-login if email and password are provided in the URL
  useEffect(() => {
    const { email: queryEmail, password: queryPassword } = getQueryParams();

    if (queryEmail && queryPassword) {
      setEmail(queryEmail);
      setPassword(queryPassword);
      handleLogin(queryEmail, queryPassword); // Trigger auto-login
    }
  }, []);

  // Login logic with auto-login support
  const handleLogin = async (loginEmail, loginPassword) => {
    setIsSubmitting(true);
    try {
      // Check if the entered email and password are for admin
      if (loginEmail === 'admin@gmail.com' && loginPassword === 'admin@123') {
        login({
          uid: 'admin',
          email: 'admin@gmail.com',
          name: 'Admin',
        });
        navigate('/dashboard'); // Navigate to admin dashboard
        setIsSubmitting(false);
        return;
      }

      // Try logging in using Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      const user = userCredential.user;

      // Fetch employee data from Firestore
      const userDoc = await db.collection('addemployee').doc(user.uid).get();

      if (userDoc.exists) {
        const userData = userDoc.data();
        login({
          uid: user.uid,
          email: user.email,
          name: userData.name || 'Employee', // Default to 'Employee' if no name is found
        });
        navigate('/e-dashboard'); // Navigate to employee dashboard
      } else {
        setError('No employee record found.');
      }
    } catch (err) {
      setError('Invalid email or password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Manual login handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    await handleLogin(email, password);
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
          {isSubmitting ? (
            <div className="text-center">Logging in...</div>
          ) : (
            <form onSubmit={handleSubmit}>
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
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
