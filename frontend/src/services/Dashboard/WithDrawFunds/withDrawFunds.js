import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const withDrawFunds = createApi({
  reducerPath: "withDrawFunds",
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
    withDrawFunds: builder.mutation({
      query: (transferDetails) => ({
        url: "/api/accounts/withdraw",
        method: "POST",
        body: transferDetails,
      }),
    }),
  }),
});

export const { useWithDrawFundsMutation } = withDrawFunds;
