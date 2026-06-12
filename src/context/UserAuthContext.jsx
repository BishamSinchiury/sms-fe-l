import React, { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import publicClient from "@/services/axios/publicClient";
import { setUserAccessToken, clearUserAccessToken, getTokenClaims } from "@/services/auth/tokenService";
import { AUTH } from "@/constants/apiRoutes";

const UserAuthContext = createContext(null);

export const useUserAuth = () => useContext(UserAuthContext);

export const UserAuthProvider = () => {
  const [user, setUser]           = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await publicClient.post(AUTH.REFRESH, {}, { withCredentials: true })
        setUserAccessToken(res.data.access)

        // Refresh only returns access token — extract user from claims
        const claims = getTokenClaims(res.data.access)
        setUser({
          uuid:       claims.user_uuid,
          email:      claims.email,
          username:   claims.username,
          isAdmin:    claims.is_admin,
          isSysadmin: claims.is_sysadmin,
        })
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  const login = async (email, password) => {
    const res = await publicClient.post(
      AUTH.LOGIN,
      { email, password },
      { withCredentials: true }
    )
    setUserAccessToken(res.data.access)
    setUser(res.data.user)
  }

  const logout = async () => {
    try {
      await publicClient.post(AUTH.LOGOUT, {}, { withCredentials: true })
    } finally {
      clearUserAccessToken()
      setUser(null)
    }
  }

  return (
    <UserAuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      logout,
    }}>
      <Outlet />
    </UserAuthContext.Provider>
  );
};