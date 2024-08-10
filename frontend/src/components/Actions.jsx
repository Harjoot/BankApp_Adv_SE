import { Grid } from "@mui/material";
import TransferFundsCard from "./TransferAmount";
import WithDrawFunds from "./WithDraw";
import Deposite from "./Deposite";

const Actions = () => {
  return (
    <>
      <Grid container sx={{ mt: 3 }}>
        <Grid item xs={12} sm={6} md={6}>
          <TransferFundsCard />
        </Grid>
        <Grid item xs={12} sm={6} md={6}>
          <WithDrawFunds />
        </Grid>
        <Grid item xs={12} sm={6} md={12}>
          <Deposite />
        </Grid>
      </Grid>
    </>
  );
};

export default Actions;
