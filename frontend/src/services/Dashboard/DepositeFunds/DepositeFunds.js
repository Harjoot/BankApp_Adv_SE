import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const depositFunds = createApi({
  reducerPath: "depositeFunds",
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
    depositFunds: builder.mutation({
      query: (transferDetails) => ({
        url: "/api/accounts/deposit",
        method: "POST",
        body: transferDetails,
      }),
    }),
  }),
});

export const { useDepositFundsMutation } = depositFunds;
