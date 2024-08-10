import React from "react";
import SideBar from "../components/Sidebar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import TinyLineChart from "../components/LineChart";
import PieChart from "../components/PieChart";
import TransactionHistory from "../components/TransactionHistory";
import Actions from "../components/Actions";
import { selectUserData } from "../services/Dashboard/UserDataSlice/userSlice";
import { useSelector } from "react-redux";
import TransactionSummary from "../components/TransactionCards";

export default function Dashboard() {
  const userData = useSelector(selectUserData);
  return (
    <Box
      sx={{ display: "flex", backgroundColor: "#FAF9F6", minHeight: "100vh" }}
    >
      <SideBar />
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, mt: { xs: "20px", md: "55px" } }}
      >
        <Typography variant="h4" gutterBottom>
          Welcome {userData?.personalInfo.firstName}, Good Evening!
        </Typography>

        <TransactionSummary />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={6}>
            <Actions />
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            <Box
              sx={{
                mt: 5,
                backgroundColor: "#fff",
                borderRadius: "20px",
                p: 3,
                boxShadow: 1,
              }}
            >
              <Typography variant="h6" gutterBottom>
                Transaction History
              </Typography>
              <TransactionHistory />
            </Box>
          </Grid>
        </Grid>

        {/* Grid of 2x2 */}
        <Grid container spacing={2} sx={{ mt: 5 }}>
          <Grid item xs={12} md={6}>
            <TinyLineChart />
          </Grid>
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <PieChart />
          </Grid>
        </Grid>

        {/* Transaction History */}
      </Box>
    </Box>
  );
}
