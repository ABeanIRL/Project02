import { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import MuiCard from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import { Link as RouterLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "600px",
  maxWidth: "60%",
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: "auto",
  boxShadow:
    "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
  ...theme.applyStyles("dark", {
    boxShadow:
      "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
  }),
}));

const RegisterContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(2),
  overflowY: "auto",
  "&::before": {
    content: '""',
    display: "block",
    position: "absolute",
    zIndex: -1,
    inset: 0,
    backgroundImage:
      "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
    backgroundRepeat: "no-repeat",
    ...theme.applyStyles("dark", {
      backgroundImage:
        "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
    }),
  },
}));

const RestaurantRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    address: "",
  });
  const [errors, setErrors] = useState({
    email: { error: false, message: "" },
    username: { error: false, message: "" },
    password: { error: false, message: "" },
    confirmPassword: { error: false, message: "" },
    firstName: { error: false, message: "" },
    lastName: { error: false, message: "" },
    address: { error: false, message: "" },
  });

  const validateInputs = () => {
    const newErrors = { ...errors };

    // Validate Email
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = {
        error: true,
        message: "Please enter a valid email address.",
      };
    } else {
      newErrors.email = { error: false, message: "" };
    }

    // Validate Username
    if (!formData.username || formData.username.length < 5) {
      newErrors.username = {
        error: true,
        message: "Username must be at least 5 characters long.",
      };
    } else {
      newErrors.username = { error: false, message: "" };
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = {
        error: true,
        message: "Please enter your password.",
      };
    } else if (formData.password.length < 8) {
      newErrors.password = {
        error: true,
        message: "Password must be at least 8 characters long.",
      };
    } else {
      newErrors.password = { error: false, message: "" };
    }

    // Validate Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = {
        error: true,
        message: "Please confirm your password.",
      };
    } else if (
      formData.confirmPassword !== formData.password ||
      formData.confirmPassword.length < 8
    ) {
      newErrors.confirmPassword = {
        error: true,
        message: "Passwords do not match.",
      };
    } else {
      newErrors.confirmPassword = { error: false, message: "" };
    }

    // Validate First Name
    if (!formData.firstName) {
      newErrors.firstName = {
        error: true,
        message: "Please enter your first name.",
      };
    } else if (formData.firstName.length > 50) {
      newErrors.firstName = {
        error: true,
        message: "First name must be a maximum of 50 characters long.",
      };
    } else {
      newErrors.firstName = { error: false, message: "" };
    }

    // Validate Last Name
    if (!formData.lastName) {
      newErrors.lastName = {
        error: true,
        message: "Please enter your last name.",
      };
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = {
        error: true,
        message: "Last name must be a maximum of 50 characters long.",
      };
    } else {
      newErrors.lastName = { error: false, message: "" };
    }

    // Validate Vehicle Model
    if (formData.address.length > 100) {
      newErrors.address = {
        error: true,
        message: "Address must be a maximum of 255 characters long.",
      };
    } else {
      newErrors.address = { error: false, message: "" };
    }
    return newErrors;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = validateInputs();
    setErrors(newErrors);
    if (Object.values(newErrors).some((e) => e.error)) {
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/restaurant/register", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          username: "",
          email: "",
          password: "",
          confirmPassword: "",
          firstName: "",
          lastName: "",
          vehicleModel: "",
          modelColor: "",
          licensePlate: "",
        });
        navigate("/restaurant/login");
      }
    } catch (error) {
      console.error("Request failed:", error.message);
    }
  };

  return (
    <RegisterContainer
      sx={{ direction: "column", justifyContent: "space-between" }}
    >
      <Card variant="outlined">
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          Sign Up
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
              <FormLabel htmlFor="username">Username</FormLabel>
              <TextField
                error={errors.username.error}
                helperText={errors.username.message}
                id="username"
                type="text"
                name="username"
                placeholder="Username..."
                autoComplete="username"
                required
                fullWidth
                variant="outlined"
                color={errors.username.error ? "error" : "primary"}
                value={formData.username}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="email">Email</FormLabel>
              <TextField
                error={errors.email.error}
                helperText={errors.email.message}
                id="email"
                type="email"
                name="email"
                placeholder="your@email.com"
                autoComplete="email"
                required
                fullWidth
                variant="outlined"
                color={errors.email.error ? "error" : "primary"}
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Password</FormLabel>
              <TextField
                error={errors.password.error}
                helperText={errors.password.message}
                id="password"
                type="password"
                name="password"
                placeholder="Password..."
                autoComplete="password"
                required
                fullWidth
                variant="outlined"
                color={errors.password.error ? "error" : "primary"}
                value={formData.password}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="password">Confirm Password</FormLabel>
              <TextField
                error={errors.confirmPassword.error}
                helperText={errors.confirmPassword.message}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password..."
                autoComplete="confirm-password"
                required
                fullWidth
                variant="outlined"
                color={errors.confirmPassword.error ? "error" : "primary"}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="firstName">First Name</FormLabel>
              <TextField
                error={errors.firstName.error}
                helperText={errors.firstName.message}
                id="firstName"
                type="text"
                name="firstName"
                placeholder="First name..."
                autoComplete="first-name"
                required
                fullWidth
                variant="outlined"
                color={errors.firstName.error ? "error" : "primary"}
                value={formData.firstName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="lastName">Last Name</FormLabel>
              <TextField
                error={errors.lastName.error}
                helperText={errors.lastName.message}
                id="lastName"
                type="text"
                name="lastName"
                placeholder="Last name..."
                autoComplete="last-name"
                required
                fullWidth
                variant="outlined"
                color={errors.lastName.error ? "error" : "primary"}
                value={formData.lastName}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="address">Address</FormLabel>
              <TextField
                error={errors.address.error}
                helperText={errors.address.message}
                id="address"
                type="text"
                name="address"
                placeholder="Address..."
                autoComplete="address"
                required
                fullWidth
                variant="outlined"
                color={errors.address.error ? "error" : "primary"}
                value={formData.address}
                onChange={handleChange}
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Register
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
                  Already have an account?&nbsp;
                  <Link component={RouterLink} to="/restaurant/login">
                    Sign In
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </Card>
    </RegisterContainer>
  );
};

export default RestaurantRegister;
