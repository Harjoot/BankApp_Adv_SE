import { Route, Routes } from "react-router";
import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import ViewAccountInformation from "./pages/ViewAccountInfo";
import RequestCheckBook from "./pages/RequestCheckBook";
import RequestATMCard from "./pages/RequestATMCard";
import { useGetLastFiveTransactionsQuery } from "./services/Dashboard/TransactionHistory/transactionHistory";
import { useDispatch } from "react-redux";
import { setUserData } from "./services/Dashboard/UserDataSlice/userSlice";
import { useEffect } from "react";

function App() {
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
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/"
          element={
            <ProtectedRoute redirectTo="/login">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-account-info"
          element={
            <ProtectedRoute redirectTo="/login">
              <ViewAccountInformation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-checkbook"
          element={
            <ProtectedRoute redirectTo="/login">
              <RequestCheckBook />
            </ProtectedRoute>
          }
        />
        <Route
          path="/request-atm-card"
          element={
            <ProtectedRoute redirectTo="/login">
              <RequestATMCard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
