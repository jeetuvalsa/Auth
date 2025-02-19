"use client";

import { AuthProvider } from "@/contexts/auth-context";
import { store } from "@/store/app";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <AuthProvider>{children}</AuthProvider>
    </Provider>
  );
}
