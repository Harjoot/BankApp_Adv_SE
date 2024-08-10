import React, { useState } from "react";
import { Card, CardContent, Typography, Modal, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { useDepositFundsMutation } from "../services/Dashboard/DepositeFunds/DepositeFunds";

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

const Deposite = () => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm();
  const [depositFunds, { isLoading }] = useDepositFundsMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    const formData = {
      amount: data.amount,
    };

    console.log(formData);
    await depositFunds(formData).unwrap();
    console.log("Deposite Funds successful");
    handleClose();
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
          <Typography variant="h5">Deposite Funds</Typography>
          <AddCircleIcon sx={{ fontSize: 50, marginTop: 5 }} />
        </CardContent>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Deposite Funds
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
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
              Deposite
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default Deposite;
