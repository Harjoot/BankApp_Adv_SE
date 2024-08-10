import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { registerSlice } from "./services/Auth/Api/register";
import { loginApi } from "./services/Auth/Api/login";
import authReducer from "./services/Auth/Slices/authSlice";
import { transferFundsApi } from "./services/Dashboard/TransferFunds/transferFunds";
import { withDrawFunds } from "./services/Dashboard/WithDrawFunds/withDrawFunds";
import { depositFunds } from "./services/Dashboard/DepositeFunds/DepositeFunds";
import { transactionsApi } from "./services/Dashboard/TransactionHistory/transactionHistory";
import userReducer from "./services/Dashboard/UserDataSlice/userSlice";
import { updateApi } from "./services/Dashboard/UpdateRecord/update";
import eraseAccount from "./services/Dashboard/EraseAccount/eraseAccountSlice";

export const store = configureStore({
  reducer: {
    [registerSlice.reducerPath]: registerSlice.reducer,
    [loginApi.reducerPath]: loginApi.reducer,
    [transferFundsApi.reducerPath]: transferFundsApi.reducer,
    [withDrawFunds.reducerPath]: withDrawFunds.reducer,
    [depositFunds.reducerPath]: depositFunds.reducer,
    [transactionsApi.reducerPath]: transactionsApi.reducer,
    [updateApi.reducerPath]: updateApi.reducer,
    [eraseAccount.reducerPath]: eraseAccount.reducer,
    auth: authReducer,
    user: userReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(registerSlice.middleware)
      .concat(loginApi.middleware)
      .concat(transferFundsApi.middleware)
      .concat(withDrawFunds.middleware)
      .concat(depositFunds.middleware)
      .concat(transactionsApi.middleware)
      .concat(updateApi.middleware)
      .concat(eraseAccount.middleware),
});

setupListeners(store.dispatch);
