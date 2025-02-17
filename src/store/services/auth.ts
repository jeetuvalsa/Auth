import { User } from '@/components/register-form'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface RegisterResponse {
    message: string;
    status: string | number;
    user: {
        id: string;
        email: string;
        name: string;
    }
}

interface LoginResponse {
    message: string;
    status: string | number;
    user: {
        refreshToken: string;
        accessToken: string;
        id: string;
        email: string;
        name: string;
    }
}

interface UserResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    _id: string;
  }
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: `http://localhost:5500/api/users/` }),
  endpoints: (builder) => ({
    register: builder.mutation<RegisterResponse, User>({
      query: (user) => ({
        url: 'register',
        method: "POST",
        body: user
      }),
    }),
    login: builder.mutation<LoginResponse, User>({
      query: (user) => ({
        url: 'login',
        method: "POST",
        body: user
      }),
    }),
    getUser: builder.query<UserResponse, void>({
      query: () => ({
        headers:{
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        },
        url: 'user',
        method: "GET",
      }),
    }),
  }),
})

export const { useRegisterMutation, useLoginMutation, useGetUserQuery } = authApi