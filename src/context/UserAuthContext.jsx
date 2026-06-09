import React, { createContext, useCallback, useContext, useEffect, useState} from "react";
import publicClient from "@/sevices/axios/publicClient";
import {
  setUserAccessToken,
  clearUserAccessToken,
  getUserAccessToken,
  getTokenClaims,
} from "@/services/auth/tokenService";
import { AUTH } from "@/constants/apiRoutes";

const UserAuthContext = createContext(null)

export const useUserAuth = () => {
    const context = useContext(UserAuthContext)
    if (!context) {
    throw new Error("useUserAuth must be used within a UserAuthProvider");
  }
  return context;
};
