import React from "react";
import { useSelector } from "react-redux";
import { PieChart } from "@mui/x-charts/PieChart";
import { selectUserData } from "../services/Dashboard/UserDataSlice/userSlice";

const BasicPieChart = () => {
  const userData = useSelector(selectUserData);

  // Calculate data for the PieChart
  let depositTotal = 0;
  let withdrawTotal = 0;

  userData?.transactions?.forEach((transaction) => {
    if (transaction.type === "Deposit") {
      depositTotal += transaction.amount;
    }
    if (transaction.type === "Withdrawal") {
      withdrawTotal += transaction.amount;
    }
  });

  const chartData = [
    { id: 0, value: depositTotal, label: "Deposits" },
    { id: 1, value: withdrawTotal, label: "Withdrawals" },
  ];

  return (
    <PieChart
      series={[
        {
          data: chartData,

          innerRadius: 30,
          outerRadius: 100,
          paddingAngle: 5,
          cornerRadius: 5,
          startAngle: -90,
          endAngle: 180,
          cx: 150,
          cy: 150,
        },
      ]}
      width={450}
      height={350}
      sx={{
        backgroundColor: "#fff",
        borderRadius: "20px",
      }}
    />
  );
};

export default BasicPieChart;
