// services/Dashboard/AccountAPI.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const eraseAccount = createApi({
  reducerPath: "eraseAccount",
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
    deleteAccount: builder.mutation({
      query: () => ({
        url: "/api/accounts/erase",
        method: "DELETE",
      }),
    }),
  }),
});

export const { useDeleteAccountMutation } = eraseAccount;
export default eraseAccount;
