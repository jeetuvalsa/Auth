"use client";

import { useAuth } from "@/contexts/auth-context";
const Settings = () => {
  const { userData, handleLogout, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Settings Page</h1>
      <p>Welcome {userData.email}</p>
      {/* Your settings page content */}
    </div>
  );
};

export default Settings;
