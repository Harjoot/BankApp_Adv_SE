import React from "react";
import { useSelector } from "react-redux";
import { Card, CardContent, Typography, Grid } from "@mui/material";
import { selectUserData } from "../services/Dashboard/UserDataSlice/userSlice";

const TransactionSummary = () => {
  const userData = useSelector(selectUserData);

  // Initialize counts
  let transferCount = 0;
  let withdrawCount = 0;
  let depositCount = 0;

  // Calculate counts based on transactions
  if (userData?.transactions) {
    userData.transactions.forEach((transaction) => {
      switch (transaction.type) {
        case "Transfer":
          transferCount += 1;
          break;
        case "Withdrawal":
          withdrawCount += 1;
          break;
        case "Deposit":
          depositCount += 1;
          break;
        default:
          break;
      }
    });
  }

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transfer Funds
            </Typography>
            <Typography variant="h4" color="primary">
              {transferCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Withdraw Funds
            </Typography>
            <Typography variant="h4" color="primary">
              {withdrawCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={4}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Deposited Funds
            </Typography>
            <Typography variant="h4" color="primary">
              {depositCount}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default TransactionSummary;
