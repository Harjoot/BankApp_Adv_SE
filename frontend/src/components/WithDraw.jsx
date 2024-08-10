import React, { useState } from "react";
import { Card, CardContent, Typography, Modal, Box } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import { useWithDrawFundsMutation } from "../services/Dashboard/WithDrawFunds/withDrawFunds";

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

const WithDrawFunds = () => {
  const [open, setOpen] = useState(false);
  const { control, handleSubmit } = useForm();
  const [withDrawFunds, { isLoading }] = useWithDrawFundsMutation();

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onSubmit = async (data) => {
    const formData = {
      amount: data.amount,
    };

    console.log(formData);
    await withDrawFunds(formData).unwrap();
    console.log("funds withdrawn");
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
          <Typography variant="h5">WithDraw Funds</Typography>
          <PriceCheckIcon sx={{ fontSize: 50, marginTop: 5 }} />
        </CardContent>
      </Card>

      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            WithDraw Funds
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
              WithDraw
            </Button>
          </form>
        </Box>
      </Modal>
    </>
  );
};

export default WithDrawFunds;
