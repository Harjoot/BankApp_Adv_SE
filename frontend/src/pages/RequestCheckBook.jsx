import React, { useState } from "react";
import { Box, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import SideBar from "../components/Sidebar";

const RequestCheckBook = () => {
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#FAF9F6", minHeight: "100vh" }}>
      <SideBar />

      <Box sx={{ margin: "100px" }}>
        <Typography variant="h3" color="textSecondary">
          Coming Soon!
        </Typography>
        <Typography variant="h5" color="textSecondary">
          Click here to get a advance registeration and be in the queue list
        </Typography>
        <Button variant="contained" color="primary" sx={{ marginTop: "20px" }} onClick={handleClickOpen}>
          Request
        </Button>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>CheckBook Application</DialogTitle>
        <DialogContent>
          <Typography>Your checkbook has been applied successfully!</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequestCheckBook;
