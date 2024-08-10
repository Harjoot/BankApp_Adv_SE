import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const updateApi = createApi({
  reducerPath: "accountApi",
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
    updateAccountInfo: builder.mutation({
      query: (updateData) => ({
        url: "/api/accounts/update",
        method: "PATCH",
        body: updateData,
      }),
    }),
  }),
});

export const { useUpdateAccountInfoMutation } = updateApi;
