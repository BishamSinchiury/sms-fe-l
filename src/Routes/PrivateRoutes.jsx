import React from "react"
import { Route } from "react-router-dom"
import Login from "@/pages/Auth/Login"
import Dashboard from "@/pages/WebApp/Dashboard"
import { UserAuthProvider } from "@/context/UserAuthContext"
import { ProtectedRoute } from "./ProtectedRoute"

export const userRoutes = (
  <Route element={<UserAuthProvider />}>
    <Route path="/login"      element={<Login />} />
    <Route element={<ProtectedRoute />}>
      <Route path="/dashboard" element={<Dashboard />} />
    </Route>
  </Route>
)