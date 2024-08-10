import React, { useState } from "react";
import { Card, CardContent, Typography, Modal, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IosShareIcon from "@mui/icons-material/IosShare";
import { useDispatch } from "react-redux";
import { useTransferFundsMutation } from "../services/Dashboard/TransferFunds/transferFunds";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const TransferFundsCard = () => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [transferFunds, { isLoading }] = useTransferFundsMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    console.log(data);
    // convert ammount to number
    const amountint = Number(data.amount);
    const formData = {
      toAccountNumber: data.accountNumber,
      amount: amountint,
    };
    await transferFunds(formData).unwrap();
    console.log(formData);
    console.log("Transfer successful");
    handleClose(); // Close the modal after submitting the form
  };

  return (
    <>
      <Card
        sx={{
          width: "340px",
          height: "170px",
          borderRadius: "20px",
          margin: 2,
          cursor: "pointer",
        }}
        onClick={handleOpen}
      >
        <CardContent>
          <Typography variant="h5">Transfer Funds</Typography>
          <IosShareIcon sx={{ fontSize: 50, marginTop: 5 }} />
        </CardContent>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Transfer Funds
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Controller
              name="accountNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Account Number"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                />
              )}
            />
            <Controller
              name="amount"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Amount"
                  fullWidth
                  margin="normal"
                  variant="outlined"
                  type="number"
                />
              )}
            />
            <Button type="submit" variant="contained" color="primary">
              Transfer
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default TransferFundsCard;
