import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import StyledCard from "../../components/Card/StyledCard";
import StyledContainer from "../../components/Container/StyledContainer";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../../features/auth/customerSlice.js";

const RestaurantLogin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/restaurant/session",
          {
            credentials: "include",
          }
        );
        const res = await response.json();
        if (res.data) {
          dispatch(setCredentials(res.data));
          navigate("/restaurant");
        }
      } catch (error) {
        localStorage.removeItem("customerUser");
        console.error("Error fetching session data:", error);
      }
    };
    checkSession();
  }, []);

  const validateInputs = () => {
    let isValid = true;
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setEmailError(true);
      setEmailErrorMessage("Please enter a valid email address.");
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage("");
    }

    if (!password) {
      setPasswordError(true);
      setPasswordErrorMessage("Please enter your password.");
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage("");
    }
    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;
    try {
      const response = await fetch("http://localhost:3000/restaurant/login", {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      const res = await response.json();
      if (response.ok) {
        dispatch(setCredentials(res.data));
        navigate("/restaurant");
      } else {
        setEmailError(true);
        setPasswordError(true);
        setPasswordErrorMessage(res.message);
      }
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  return (
    <StyledContainer
      sx={{ direction: "column", justifyContent: "space-between" }}
    >
      <StyledCard variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign In
        </Typography>
        <Box
          sx={{
            padding: 4,
            marginTop: 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              mt: 1,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={emailError}
                helperText={emailErrorMessage}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={emailError ? "error" : "primary"}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={passwordError}
                helperText={passwordErrorMessage}
                id="password"
                type="password"
                name="password"
                placeholder=""
                required
                fullWidth
                variant="outlined"
                color={passwordError ? "error" : "primary"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                width: "100%",
              }}
            >
              <Box>
                <Typography variant="body2">
                  Don&apos;t have an account?&nbsp;
                  <Link component={RouterLink} to="/restaurant/register">
                    Sign Up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </StyledCard>
    </StyledContainer>
  );
};

export default RestaurantLogin;
