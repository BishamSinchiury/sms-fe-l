import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useUserAuth } from "@/context/UserAuthContext"
import { useAdminAuth } from "@/context/AdminAuthContext"

export const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useUserAuth()
  console.log("sadf",isAuthenticated)

  if (isLoading) return null
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />
}

export const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) return null
  

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />
}