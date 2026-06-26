// /home/bisham/Code/sms-no-ai/fe/src/Routes/PrivateRoutes.jsx
import React from "react"
import { Route } from "react-router-dom"
import Login from "@/pages/Auth/Login"
import Signup from "@/pages/Auth/Signup"
import Dashboard from "@/pages/WebApp/Dashboard"
import ForgotPassword from "@/pages/Auth/ForgotPassword"

// inside userRoutes:

import { UserAuthProvider } from "@/context/UserAuthContext"
import { ProtectedRoute } from "./ProtectedRoute"

export const userRoutes = (
  <Route element={<UserAuthProvider />}>
    <Route path="/login"      element={<Login />} />
    <Route path="/signup"     element={<Signup />} />
    <Route path="/forgot-password" element={<ForgotPassword />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  </Route>
)