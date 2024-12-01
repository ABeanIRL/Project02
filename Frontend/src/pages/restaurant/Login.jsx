import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import RestaurantFooter from "../../components/RestaurantFooter";
import RestaurantHeader from "../../components/RestaurantHeader";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/restaurant/login", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        navigate("/restaurant");
      }
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  const validateInputs = () => {
    let isValid = true;
    if (!email || !(/\S+@\S+\.\S+/.test(email))) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password || password.length < 8) {
      setPasswordError(true);
      setPasswordErrorMessage("Password must be at least 8 characters long.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    return isValid;
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <div style={{ position: "fixed", top: 0, width: "100%", zIndex: 1000 }}>
        <RestaurantHeader />
      </div>
      <Container maxWidth="sm" style={{ flex: 1, marginTop: "5rem", marginBottom: "2rem" }}>
        <Box
          sx={{
            backgroundColor: "#ffe6e6",
            padding: "2rem",
            borderRadius: "10px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            marginTop: "4rem",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              textAlign: "center",
              fontFamily: "Cormorant Garamond, serif",
              marginBottom: "2rem",
            }}
          >
            Login to Gustosa
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              id="email"
              name="email"
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={emailError}
              helperText={emailErrorMessage}
              sx={{ marginBottom: "1rem" }}
            />
            <TextField
              fullWidth
              id="password"
              name="password"
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={passwordError}
              helperText={passwordErrorMessage}
              sx={{ marginBottom: "1rem" }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "darkred",
                color: "white",
                "&:hover": { backgroundColor: "#b30000" },
              }}
            >
              Submit
            </Button>
          </form>
        </Box>
      </Container>
      <div style={{ marginTop: "auto" }}>
        <RestaurantFooter />
      </div>
    </div>
  );
};

export default Login;
