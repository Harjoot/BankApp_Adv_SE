import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const registerSlice = createApi({
  reducerPath: "register",
  baseQuery: fetchBaseQuery({ baseUrl: `${import.meta.env.VITE_BASE_URL}` }),
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (formData) => ({
        url: "/api/accounts",
        method: "POST",
        body: formData,
      }),
    }),
  }),
});

export const { useCreateAccountMutation } = registerSlice;
