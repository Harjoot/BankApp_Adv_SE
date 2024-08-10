import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Box, TextField, Button, Typography, Container } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLoginMutation } from "../services/Auth/Api/login";
import { setToken, removeToken } from "../services/Auth/Slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import SnackbarAlert from "../components/Snackbar";
import { jwtDecode } from "jwt-decode";

const getTokenExpirationTime = (token) => {
  const decoded = jwtDecode(token);
  return decoded.exp * 1000 - Date.now();
};

const LoginForm = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const response = await login(data).unwrap();
      const { token } = response;
      localStorage.setItem("authToken", token);
      dispatch(setToken(token));

      // Set timeout to handle token expiration
      const expirationTime = getTokenExpirationTime(token);
      setTimeout(() => {
        localStorage.removeItem("authToken");
        dispatch(removeToken());
        navigate("/login");
      }, expirationTime);

      setSnackbarOpen(true);
      setSnackbarMessage("Login successful!");
      setSnackbarSeverity("success");
      navigate("/");
    } catch (error) {
      setSnackbarMessage("Error logging in. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error logging in:", error);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const expirationTime = getTokenExpirationTime(token);
      if (expirationTime <= 0) {
        localStorage.removeItem("authToken");
        dispatch(removeToken());
        navigate("/login");
      }
    }
  }, [dispatch, navigate]);

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ maxWidth: 400, mx: "auto", mt: 5 }}
      >
        <Typography variant="h4" gutterBottom>
          Login to your account
        </Typography>
        <Controller
          name="accountNumber"
          control={control}
          defaultValue=""
          rules={{ required: "Account number is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Account Number"
              fullWidth
              margin="normal"
              error={!!errors.accountNumber}
              helperText={
                errors.accountNumber ? errors.accountNumber.message : ""
              }
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          defaultValue=""
          rules={{ required: "Password is required" }}
          render={({ field }) => (
            <TextField
              {...field}
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              error={!!errors.password}
              helperText={errors.password ? errors.password.message : ""}
            />
          )}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login"}
        </Button>

        <Box>
          <Typography variant="body2" mt={2}>
            Don't have an account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Box>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
        sx={{ position: "fixed", bottom: 20, left: 20 }}
      />
    </Container>
  );
};

export default LoginForm;
