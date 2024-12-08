import { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Link from "@mui/material/Link";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import StyledCard from "../../components/Card/StyledCard";
import StyledContainer from "../../components/Container/StyledContainer";

const DriverRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({
    email: { error: false, message: "" },
    username: { error: false, message: "" },
    password: { error: false, message: "" },
    confirmPassword: { error: false, message: "" },
    firstName: { error: false, message: "" },
    lastName: { error: false, message: "" },
    vehicleModel: { error: false, message: "" },
    modelColor: { error: false, message: "" },
    licensePlate: { error: false, message: "" },
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
    if (formData.vehicleModel.length > 100) {
      newErrors.vehicleModel = {
        error: true,
        message: "Vehicle model must be a maximum of 100 characters long.",
      };
    } else {
      newErrors.vehicleModel = { error: false, message: "" };
    }

    // Validate Model Color
    if (formData.modelColor.length > 50) {
      newErrors.modelColor = {
        error: true,
        message: "Model color must be a maximum of 50 characters long.",
      };
    } else {
      newErrors.modelColor = { error: false, message: "" };
    }

    // Validate License Plate
    if (formData.licensePlate.length > 15) {
      newErrors.licensePlate = {
        error: true,
        message: "License plate must be a maximum of 15 characters long.",
      };
    } else {
      newErrors.licensePlate = { error: false, message: "" };
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
    if (Object.values(newErrors).some((e) => e.error)) return;
    try {
      const response = await fetch("http://localhost:3000/driver/register", {
        headers: { "Content-Type": "application/json" },
        method: "POST",
        body: JSON.stringify(formData),
      });

      const res = await response.json();
      if (response.ok) {
        navigate("/driver/login");
      } else {
        const updatedErrors = { ...errors };
        res.error.forEach((e) => {
          updatedErrors[e.path] = { error: true, message: e.msg };
        });
        setErrors(updatedErrors);
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
              <FormLabel htmlFor="vehicleModel">Vehicle Model</FormLabel>
              <TextField
                error={errors.vehicleModel.error}
                helperText={errors.vehicleModel.message}
                id="vehicleModel"
                type="text"
                name="vehicleModel"
                autoComplete="vehicle-model"
                fullWidth
                variant="outlined"
                color={errors.vehicleModel.error ? "error" : "primary"}
                value={formData.vehicleModel}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="modelColor">Model Color</FormLabel>
              <TextField
                error={errors.modelColor.error}
                helperText={errors.modelColor.message}
                id="modelColor"
                type="text"
                name="modelColor"
                autoComplete="model-color"
                fullWidth
                variant="outlined"
                color={errors.modelColor.error ? "error" : "primary"}
                value={formData.modelColor}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="licensePlate">License Plate</FormLabel>
              <TextField
                error={errors.licensePlate.error}
                helperText={errors.licensePlate.message}
                id="licensePlate"
                type="text"
                name="licensePlate"
                autoComplete="license-plate"
                fullWidth
                variant="outlined"
                color={errors.licensePlate.error ? "error" : "primary"}
                value={formData.licensePlate}
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
                  <Link component={RouterLink} to="/driver/login">
                    Sign In
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

export default DriverRegister;
