import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useCreateAccountMutation } from "../services/Auth/Api/register";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import SnackbarAlert from "../components/Snackbar";

const Register = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [accountNumber, setAccountNumber] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
    trigger,
    getValues,
  } = useForm();
  const [createAccount, { isLoading }] = useCreateAccountMutation();
  const navigate = useNavigate();

  const steps = [
    "Personal Information",
    "Account Details",
    "Legal Compliance",
    "Security Info",
    "Review & Submit",
  ];

  const onSubmit = async (data) => {
    try {
      const formData = {
        personalInfo: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          email: data.email,
          phoneNumber: data.phoneNumber,
          address: {
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
          },
        },
        accountDetails: {
          accountCategory: data.accountCategory,
          accountType: data.accountType,
        },
        legalCompliance: {
          citizenshipStatus: data.citizenshipStatus,
          governmentIdType: data.governmentIdType,
          governmentIdNumber: data.governmentIdNumber,
          termsAccepted: data.termsAccepted,
          privacyPolicyAgreed: data.privacyPolicyAgreed,
        },
        securityInfo: {
          username: data.username,
          password: data.password,
          confirmPassword: data.confirmPassword,
          twoFactorAuthEnabled: data.twoFactorAuthEnabled,
        },
        systemFields: {},
      };

      const response = await createAccount(formData).unwrap();
      console.log("Response from createAccount:", response);
      setAccountNumber(response.accountNumber);
      setSnackbarMessage("Account created successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      setModalOpen(true);
    } catch (error) {
      setSnackbarMessage("Error creating account. Please try again.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      console.error("Error creating account:", error);
    }
  };

  const handleModalClose = () => {
    setModalOpen(false);
    navigate("/login");
  };

  const validateCurrentStep = async () => {
    const isValid = await trigger();
    return isValid;
  };

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      handleSubmit(onSubmit)();
    } else {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setActiveStep((prevStep) => prevStep + 1);
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          height: "100vh",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            marginBottom: "25px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Create an Account
        </Typography>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form>
          <Box sx={{ mt: 3 }}>
            {activeStep === 0 && (
              <Grid container spacing={2}>
                {/* Personal Information */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="firstName"
                    control={control}
                    defaultValue=""
                    rules={{ required: "First name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="First Name"
                        fullWidth
                        error={!!errors.firstName}
                        helperText={
                          errors.firstName ? errors.firstName.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="lastName"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Last name is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Last Name"
                        fullWidth
                        error={!!errors.lastName}
                        helperText={
                          errors.lastName ? errors.lastName.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="dateOfBirth"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Date of birth is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Date of Birth"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        fullWidth
                        error={!!errors.dateOfBirth}
                        helperText={
                          errors.dateOfBirth ? errors.dateOfBirth.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="email"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Email is required",
                      pattern: {
                        value:
                          /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                        message: "Enter a valid email address",
                      },
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Email"
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email ? errors.email.message : ""}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="phoneNumber"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Phone number is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Phone Number"
                        fullWidth
                        error={!!errors.phoneNumber}
                        helperText={
                          errors.phoneNumber ? errors.phoneNumber.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="street"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Street" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="city"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="City" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="state"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="State" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="zipCode"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Zip Code" fullWidth />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="country"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <TextField {...field} label="Country" fullWidth />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "17px",
                    }}
                  >
                    Already have an account? <Link to="/login">Login</Link>
                  </Typography>
                </Grid>
              </Grid>
            )}

            {activeStep === 1 && (
              <Grid container spacing={2}>
                {/* Account Details */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="accountCategory"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Account category is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Account Category"
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                        error={!!errors.accountCategory}
                        helperText={
                          errors.accountCategory
                            ? errors.accountCategory.message
                            : ""
                        }
                      >
                        <option value=""></option>
                        <option value="Personal">Personal</option>
                        <option value="Business">Business</option>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="accountType"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Account type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Account Type"
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                        error={!!errors.accountType}
                        helperText={
                          errors.accountType ? errors.accountType.message : ""
                        }
                      >
                        <option value=""></option>
                        <option value="Savings">Savings</option>
                        <option value="Checking">Checking</option>
                      </TextField>
                    )}
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 2 && (
              <Grid container spacing={2}>
                {/* Legal Compliance */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="citizenshipStatus"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Citizenship status is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Citizenship Status"
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                        error={!!errors.citizenshipStatus}
                        helperText={
                          errors.citizenshipStatus
                            ? errors.citizenshipStatus.message
                            : ""
                        }
                      >
                        <option value=""></option>
                        <option value="Citizen">Citizen</option>
                        <option value="Permanent Resident">
                          Permanent Resident
                        </option>
                        <option value="Visa Holder">Visa Holder</option>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="governmentIdType"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Government ID type is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Government ID Type"
                        select
                        fullWidth
                        SelectProps={{
                          native: true,
                        }}
                        error={!!errors.governmentIdType}
                        helperText={
                          errors.governmentIdType
                            ? errors.governmentIdType.message
                            : ""
                        }
                      >
                        <option value=""></option>
                        <option value="Passport">Passport</option>
                        <option value="Driver's License">
                          Driver's License
                        </option>
                        <option value="National ID">National ID</option>
                      </TextField>
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Controller
                    name="governmentIdNumber"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Government ID number is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Government ID Number"
                        fullWidth
                        error={!!errors.governmentIdNumber}
                        helperText={
                          errors.governmentIdNumber
                            ? errors.governmentIdNumber.message
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="termsAccepted"
                        control={control}
                        defaultValue={false}
                        rules={{
                          required: "You must accept the terms and conditions",
                        }}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label="I accept the terms and conditions"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="privacyPolicyAgreed"
                        control={control}
                        defaultValue={false}
                        rules={{
                          required: "You must agree to the privacy policy",
                        }}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label="I agree to the privacy policy"
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 3 && (
              <Grid container spacing={2}>
                {/* Security Info */}
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="username"
                    control={control}
                    defaultValue=""
                    rules={{ required: "Username is required" }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Username"
                        fullWidth
                        error={!!errors.username}
                        helperText={
                          errors.username ? errors.username.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
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
                        error={!!errors.password}
                        helperText={
                          errors.password ? errors.password.message : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Controller
                    name="confirmPassword"
                    control={control}
                    defaultValue=""
                    rules={{
                      required: "Confirm password is required",
                      validate: (value) =>
                        value === getValues("password") ||
                        "Passwords do not match",
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        error={!!errors.confirmPassword}
                        helperText={
                          errors.confirmPassword
                            ? errors.confirmPassword.message
                            : ""
                        }
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Controller
                        name="twoFactorAuthEnabled"
                        control={control}
                        defaultValue={false}
                        render={({ field }) => (
                          <Checkbox
                            {...field}
                            checked={field.value}
                            color="primary"
                          />
                        )}
                      />
                    }
                    label="Enable Two-Factor Authentication"
                  />
                </Grid>
              </Grid>
            )}

            {activeStep === 4 && (
              <Grid container spacing={2}>
                {/* Review & Submit */}
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Review Your Information
                  </Typography>
                  <Typography variant="body1">
                    <strong>Personal Information:</strong>
                  </Typography>
                  <Typography variant="body2">{`Name: ${getValues("firstName")} ${getValues("lastName")}`}</Typography>
                  <Typography variant="body2">{`Date of Birth: ${getValues("dateOfBirth")}`}</Typography>
                  <Typography variant="body2">{`Email: ${getValues("email")}`}</Typography>
                  <Typography variant="body2">{`Phone Number: ${getValues("phoneNumber")}`}</Typography>
                  <Typography variant="body2">{`Address: ${getValues("street")}, ${getValues("city")}, ${getValues("state")}, ${getValues("zipCode")}, ${getValues("country")}`}</Typography>
                  <Typography variant="body1">
                    <strong>Account Details:</strong>
                  </Typography>
                  <Typography variant="body2">{`Account Category: ${getValues("accountCategory")}`}</Typography>
                  <Typography variant="body2">{`Account Type: ${getValues("accountType")}`}</Typography>
                  <Typography variant="body1">
                    <strong>Legal Compliance:</strong>
                  </Typography>
                  <Typography variant="body2">{`Citizenship Status: ${getValues("citizenshipStatus")}`}</Typography>
                  <Typography variant="body2">{`Government ID Type: ${getValues("governmentIdType")}`}</Typography>
                  <Typography variant="body2">{`Government ID Number: ${getValues("governmentIdNumber")}`}</Typography>
                  <Typography variant="body2">{`Terms Accepted: ${getValues("termsAccepted") ? "Yes" : "No"}`}</Typography>
                  <Typography variant="body2">{`Privacy Policy Agreed: ${getValues("privacyPolicyAgreed") ? "Yes" : "No"}`}</Typography>
                  <Typography variant="body1">
                    <strong>Security Information:</strong>
                  </Typography>
                  <Typography variant="body2">{`Username: ${getValues("username")}`}</Typography>
                  <Typography variant="body2">{`Two-Factor Authentication Enabled: ${getValues("twoFactorAuthEnabled") ? "Yes" : "No"}`}</Typography>
                </Grid>
              </Grid>
            )}

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={isLoading}
              >
                {activeStep === steps.length - 1 ? "Submit" : "Next"}
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        handleClose={handleSnackbarClose}
      />

      <Dialog open={modalOpen} onClose={handleModalClose}>
        <DialogTitle>Account Created Successfully</DialogTitle>
        <DialogContent>
          <Typography>Your account number is: {accountNumber}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Register;
