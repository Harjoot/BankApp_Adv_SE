import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { selectUserData } from "../services/Dashboard/UserDataSlice/userSlice";
import { useUpdateAccountInfoMutation } from "../services/Dashboard/UpdateRecord/update.js";
import { useDeleteAccountMutation } from "../services/Dashboard/EraseAccount/eraseAccountSlice.js";
import SideBar from "../components/Sidebar";
import { useNavigate } from "react-router";

const ViewAccountInformation = () => {
  const userData = useSelector(selectUserData);
  const [updateAccount] = useUpdateAccountInfoMutation();
  const [deleteAccount] = useDeleteAccountMutation();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: userData?.personalInfo?.firstName || "",
    lastName: userData?.personalInfo?.lastName || "",
    email: userData?.personalInfo?.email || "",
    phoneNumber: userData?.personalInfo?.phoneNumber || "",
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const dataToSend = { personalInfo: formData };
      await updateAccount(dataToSend).unwrap();
      handleClose();
    } catch (error) {
      console.error("Failed to update account:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteAccount().unwrap();
      alert("Account deleted successfully");
      localStorage.removeItem("authToken");
      navigate("/login"); // Corrected typo from 'nevigate' to 'navigate'
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Failed to delete account");
    }
  };

  if (!userData) {
    return (
      <Typography variant="h6" color="textSecondary" align="center">
        No user data available
      </Typography>
    );
  }

  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#FAF9F6", minHeight: "100vh" }}
    >
      <SideBar />
      <Box sx={{ padding: 4, flexGrow: 1 }}>
        <Typography variant="h4" mt={7} gutterBottom>
          Account Information
        </Typography>
        <Grid container spacing={3}>
          {/* Personal Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box>
                  <Typography variant="h6">Personal Information</Typography>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="body1">
                    <strong>Name:</strong> {userData.personalInfo?.firstName}{" "}
                    {userData.personalInfo?.lastName}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Date of Birth:</strong>{" "}
                    {new Date(
                      userData.personalInfo?.dateOfBirth,
                    ).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {userData.personalInfo?.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Phone:</strong> {userData.personalInfo?.phoneNumber}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Address:</strong>{" "}
                    {userData.personalInfo?.address?.street},{" "}
                    {userData.personalInfo?.address?.city},{" "}
                    {userData.personalInfo?.address?.state},{" "}
                    {userData.personalInfo?.address?.zipCode},{" "}
                    {userData.personalInfo?.address?.country}
                  </Typography>
                </Box>
                <IconButton onClick={handleOpen} color="primary">
                  <EditIcon />
                </IconButton>
              </CardContent>
            </Card>
          </Grid>
          {/* Account Details */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Account Details</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  <strong>Account Number:</strong> {userData.accountNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Account Category:</strong>{" "}
                  {userData.accountDetails?.accountCategory}
                </Typography>
                <Typography variant="body1">
                  <strong>Account Type:</strong>{" "}
                  {userData.accountDetails?.accountType}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Legal Compliance */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Legal Compliance</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  <strong>Citizenship Status:</strong>{" "}
                  {userData.legalCompliance?.citizenshipStatus}
                </Typography>
                <Typography variant="body1">
                  <strong>Government ID Type:</strong>{" "}
                  {userData.legalCompliance?.governmentIdType}
                </Typography>
                <Typography variant="body1">
                  <strong>Government ID Number:</strong>{" "}
                  {userData.legalCompliance?.governmentIdNumber}
                </Typography>
                <Typography variant="body1">
                  <strong>Terms Accepted:</strong>{" "}
                  {userData.legalCompliance?.termsAccepted ? "Yes" : "No"}
                </Typography>
                <Typography variant="body1">
                  <strong>Privacy Policy Agreed:</strong>{" "}
                  {userData.legalCompliance?.privacyPolicyAgreed ? "Yes" : "No"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* Security Information */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">Security Information</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  <strong>Username:</strong> {userData.securityInfo?.username}
                </Typography>
                <Typography variant="body1">
                  <strong>Two-Factor Auth Enabled:</strong>{" "}
                  {userData.securityInfo?.twoFactorAuthEnabled ? "Yes" : "No"}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {/* System Fields */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6">System Fields</Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="body1">
                  <strong>Account Status:</strong>{" "}
                  {userData.systemFields?.accountStatus}
                </Typography>
                <Typography variant="body1">
                  <strong>Account Creation Date:</strong>{" "}
                  {new Date(
                    userData.systemFields?.accountCreationDate,
                  ).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Update Account Information</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              name="firstName"
              label="First Name"
              type="text"
              fullWidth
              variant="standard"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="lastName"
              label="Last Name"
              type="text"
              fullWidth
              variant="standard"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="standard"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              margin="dense"
              name="phoneNumber"
              label="Phone Number"
              type="tel"
              fullWidth
              variant="standard"
              value={formData.phoneNumber}
              onChange={handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="secondary">
              Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Account Button */}
        <Box mt={4}>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete Account
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ViewAccountInformation;
