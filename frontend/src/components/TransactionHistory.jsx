import React, { useEffect } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useGetLastFiveTransactionsQuery } from "../services/Dashboard/TransactionHistory/transactionHistory";
import { useDispatch } from "react-redux";
import { setUserData } from "../services/Dashboard/UserDataSlice/userSlice";

const TransactionHistory = () => {
  const { data, isLoading, error } = useGetLastFiveTransactionsQuery(
    undefined,
    {
      pollingInterval: 5000,
    },
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (data) {
      dispatch(setUserData(data));
    }
  }, [data, dispatch]);

  if (isLoading) {
    return <CircularProgress />;
  }

  if (error) {
    return (
      <Typography variant="h6" color="error">
        Loading.....
      </Typography>
    );
  }

  return (
    <List
      sx={{
        backgroundColor: "#fff",
        borderRadius: "20px",
        padding: "20px",
        height: "300px",
        overflowY: "auto",
      }}
    >
      {data?.transactions?.map((transaction) => (
        <ListItem key={transaction._id}>
          <ListItemText
            primary={
              <Typography variant="body1" fontWeight="bold">
                {transaction.type} - {transaction.amount} {transaction.currency}
              </Typography>
            }
            secondary={
              <Typography variant="body2" color="textSecondary">
                Status: {transaction.status} <br />
                Date: {new Date(transaction.createdAt).toLocaleString()} <br />
                Transaction ID: {transaction.transactionId}
              </Typography>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};

export default TransactionHistory;
