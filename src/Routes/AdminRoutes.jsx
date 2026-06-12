import React from "react"
import { Route } from "react-router-dom"
import AdminLogin from "@/pages/Auth/AdminLogin"
import AdminDashboard from "@/pages/Admin/AdminDashboard"
import { AdminAuthProvider } from "@/context/AdminAuthContext"
import { AdminProtectedRoute } from "./ProtectedRoute"

export const adminRoutes = (
  <Route element={<AdminAuthProvider />}>
    <Route path="/admin/login"      element={<AdminLogin />} />
    <Route element={<AdminProtectedRoute />}>
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
    </Route>
  </Route>
)