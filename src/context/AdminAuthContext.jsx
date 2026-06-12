import React, { createContext, useContext, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import publicClient from "@/services/axios/publicClient";
import { setAdminAccessToken, clearAdminAccessToken, getTokenClaims } from "@/services/auth/tokenService";
import { ADMIN_AUTH } from "@/constants/apiRoutes";

const AdminAuthContext = createContext(null);

export const useAdminAuth = () => useContext(AdminAuthContext);

export const AdminAuthProvider = () => {
  const [user, setUser]                 = useState(null);
  const [isLoading, setIsLoading]       = useState(true);
  const [otpStep, setOtpStep]           = useState("credentials");
  const [pendingEmail, setPendingEmail] = useState(null);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await publicClient.post(ADMIN_AUTH.REFRESH, {}, { withCredentials: true })
        setAdminAccessToken(res.data.access)

        // Same as UserAuthContext — refresh only returns access token
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

  const adminLogin = async (email, password) => {
    await publicClient.post(
      ADMIN_AUTH.LOGIN,
      { email, password },
      { withCredentials: true }
    )
    setPendingEmail(email)
    setOtpStep("otp")
  }

  const adminVerifyOtp = async (otp) => {
    const res = await publicClient.post(
      ADMIN_AUTH.VERIFY_OTP,
      { email: pendingEmail, otp },
      { withCredentials: true }
    )
    setAdminAccessToken(res.data.access)
    setUser(res.data.user)   // ← verify endpoint returns full user, this is fine
    setOtpStep("credentials")
    setPendingEmail(null)
  }

  const resetOtpFlow = () => {
    setOtpStep("credentials")
    setPendingEmail(null)
  }

  const logout = async () => {
    try {
      await publicClient.post(ADMIN_AUTH.LOGOUT, {}, { withCredentials: true })
    } finally {
      clearAdminAccessToken()
      setUser(null)
      setOtpStep("credentials")
      setPendingEmail(null)
    }
  }

  return (
    <AdminAuthContext.Provider value={{
      user,
      isLoading,
      isAuthenticated: !!user,
      otpStep,
      pendingEmail,
      adminLogin,
      adminVerifyOtp,
      resetOtpFlow,
      logout,
    }}>
      <Outlet />
    </AdminAuthContext.Provider>
  );
};