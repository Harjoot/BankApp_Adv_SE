import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { jwtDecode } from "jwt-decode";

export const decodeJwtToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {
    console.error("Failed to decode JWT token:", error);
    return null;
  }
};

export const transactionsApi = createApi({
  reducerPath: "transactionsApi",
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
    getLastFiveTransactions: builder.query({
      query: () => {
        const token = localStorage.getItem("authToken");
        let accountNumber;

        if (token) {
          const decodedToken = decodeJwtToken(token);
          accountNumber = decodedToken?.accountNumber;

          // You can use a hook here to dispatch, but it's better to avoid hooks in the API configuration
          // Use the token data elsewhere in your app where hooks are valid
        }

        return `/api/accounts/get-user-account/${accountNumber}`;
      },
    }),
  }),
});

export const { useGetLastFiveTransactionsQuery } = transactionsApi;
