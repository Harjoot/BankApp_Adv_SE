import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const transferFundsApi = createApi({
  reducerPath: "transferFunds",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BASE_URL}`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("authToken");

      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  endpoints: (builder) => ({
    transferFunds: builder.mutation({
      query: (transferDetails) => ({
        url: "/api/accounts/transfer",
        method: "POST",
        body: transferDetails,
      }),
    }),
  }),
});

export const { useTransferFundsMutation } = transferFundsApi;
