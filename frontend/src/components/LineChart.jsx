import React from "react";
import { useSelector } from "react-redux";
import { ChartContainer } from "@mui/x-charts/ChartContainer";
import {
  LinePlot,
  MarkPlot,
  lineElementClasses,
  markElementClasses,
} from "@mui/x-charts/LineChart";
import { Box } from "@mui/material";
import { selectUserData } from "../services/Dashboard/UserDataSlice/userSlice";

const calculateMinuteTransactions = (transactions) => {
  const minuteData = {};

  transactions.forEach((transaction) => {
    // Extract date and time in minutes format
    const date = new Date(transaction.createdAt);
    const minute = `${date.toISOString().split("T")[0]} ${date.getHours()}:${Math.floor(date.getMinutes() / 5) * 5}`; // Group by 5 minutes intervals

    if (!minuteData[minute]) {
      minuteData[minute] = 0;
    }

    minuteData[minute] += 1;
  });

  const sortedMinutes = Object.keys(minuteData).sort();
  const transactionCounts = sortedMinutes.map((minute) => minuteData[minute]);

  return {
    transactionCounts,
    xLabels: sortedMinutes,
  };
};

export default function TinyLineChart() {
  const userData = useSelector(selectUserData);

  if (!userData?.transactions) {
    return null; // Or a loading indicator
  }

  const { transactionCounts, xLabels } = calculateMinuteTransactions(
    userData.transactions,
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: "20px",
      }}
    >
      <ChartContainer
        width={1000}
        height={350}
        series={[
          {
            type: "line",
            data: transactionCounts,
            label: "Transactions per Minute",
          },
        ]}
        xAxis={[{ scaleType: "point", data: xLabels }]}
        sx={{
          [`& .${lineElementClasses.root}`]: {
            stroke: "#8884d8",
            strokeWidth: 2,
          },
          [`& .${markElementClasses.root}`]: {
            stroke: "#8884d8",
            scale: "0.6",
            fill: "#fff",
            strokeWidth: 2,
          },
        }}
        disableAxisListener
      >
        <LinePlot />
        <MarkPlot />
      </ChartContainer>
    </Box>
  );
}
