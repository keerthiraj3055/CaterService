
import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Container, 
  Box, 
  Card, 
  CardContent, 
  TextField, 
  Button, 
  Typography, 
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../api/axiosInstance';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await axiosInstance.post('/auth/login', { email, password });
      login(res.data);
      // Redirect based on role
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'employee') navigate('/employee');
      else if (role === 'corporate') navigate('/corporate');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-slate-100">
      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card elevation={8} sx={{ borderRadius: 3, overflow: 'hidden' }}>
            <Box 
              sx={{ 
                background: 'linear-gradient(135deg, #4F46E5 0%, #4338CA 100%)',
                py: 4,
                textAlign: 'center'
              }}
            >
              <Typography variant="h3" sx={{ mb: 1 }}>🍽️</Typography>
              <Typography variant="h4" fontWeight="bold" color="white">
                FoodServe
              </Typography>
              <Typography variant="subtitle1" color="rgba(255,255,255,0.9)">
                Your Catering Partner
              </Typography>
            </Box>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ mb: 3, color: 'primary.main' }}>
                Welcome Back
              </Typography>
              
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  sx={{ 
                    py: 1.5,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600
                  }}
                >
                  Sign In
                </Button>
              </form>

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link to="/register" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: 600 }}>
                    Register here
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
