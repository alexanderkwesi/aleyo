// LoginPage.js
import React, { useState } from "react";
import { Box, Container, Paper, TextField, Button, Typography, Link, Alert, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import logoImage from './public/logo-1.png';

const G_START = '#4F6EF7';
const G_MID = '#2DBCB6';
const G_END = '#3ED67C';
const GRAD = `linear-gradient(135deg, ${G_START} 0%, ${G_MID} 50%, ${G_END} 100%)`;

const API_BASE = process.env.REACT_APP_API_URL || "http://127.0.0.1:8000";

const LoginPage = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Invalid email or password");
        return;
      }

      localStorage.setItem("authToken", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", background: "linear-gradient(135deg, #080C14 0%, #0F172A 100%)" }}>
      <Container maxWidth="sm">
        <Paper sx={{ p: 4, borderRadius: 4, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
              <img
              src={logoImage}
              alt="Aleyo Logo"
              style={{
                width: 48,
                height: 48,
                marginBottom: 16,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/')}
            />
            <Typography variant="h5" sx={{ color: 'white' }}>Welcome Back</Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 3, background: 'rgba(220,38,38,0.1)', color: '#f87171', border: '1px solid #dc2626' }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Email" name="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} InputProps={{ startAdornment: (<InputAdornment position="start"><Email sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>) }} />
            <TextField fullWidth label="Password" type={showPassword ? "text" : "password"} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required sx={{ mb: 2, '& .MuiOutlinedInput-root': { color: 'white', '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' } } }} InputProps={{ startAdornment: (<InputAdornment position="start"><Lock sx={{ color: 'rgba(255,255,255,0.5)' }} /></InputAdornment>), endAdornment: (<InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)}>{showPassword ? <VisibilityOff /> : <Visibility />}</IconButton></InputAdornment>) }} />
            <Button fullWidth type="submit" variant="contained" size="large" disabled={loading} sx={{ background: GRAD, borderRadius: '999px', textTransform: 'none', py: 1.5, mb: 2 }}>{loading ? "Signing in..." : "Sign In"}</Button>
            <Typography align="center"><Link component={RouterLink} to="/forgot-password" sx={{ color: G_MID }}>Forgot password?</Link></Typography>
            <Typography align="center" sx={{ mt: 2, color: 'rgba(255,255,255,0.6)' }}>Don't have an account? <Link component={RouterLink} to="/signup" sx={{ color: G_START }}>Sign up</Link></Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
