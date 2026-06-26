import React from "react"
import { Navigate, Outlet } from "react-router-dom"
import { useUserAuth } from "@/context/UserAuthContext"
import { useAdminAuth } from "@/context/AdminAuthContext"

export const ProtectedRoute = () => {
  const { user, isAuthenticated, isLoading, logout } = useUserAuth()

  if (isLoading) return null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (isAuthenticated && !user?.isVerified) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', backgroundColor: '#111827', color: '#fff', textAlign: 'center', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Pending Approval</h1>
        <p style={{ color: '#9ca3af', maxWidth: '400px', marginBottom: '2rem' }}>Your account has been verified, but you need an administrator to approve your access before you can use the dashboard.</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={() => window.location.href = "/"} style={{ padding: '0.6rem 1.2rem', background: '#4f46e5', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Return to Home</button>
          <button onClick={logout} style={{ padding: '0.6rem 1.2rem', background: '#ef4444', border: 'none', borderRadius: '6px', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>Logout</button>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export const AdminProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAdminAuth()

  if (isLoading) return null
  

  return isAuthenticated ? <Outlet /> : <Navigate to="/admin/login" replace />
}