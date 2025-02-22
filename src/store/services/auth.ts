import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthResponse {
  status: number;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_URL,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, { email: string; password: string }>({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<
      AuthResponse,
      { name: string; email: string; password: string }
    >({
      query: (userData) => ({
        url: "register",
        method: "POST",
        body: userData,
      }),
    }),
    getUser: builder.query<{ status: number; user: User }, void>({
      query: () => "user",
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "refresh-token",
        method: "POST",
        body: {
          refreshToken: localStorage.getItem("refreshToken"),
        },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetUserQuery,
  useRefreshTokenMutation,
} = authApi;
