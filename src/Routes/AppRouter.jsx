import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { websiteroutes } from './PublicRoutes'
import { authRoutes }    from './AuthRoutes'
import NotFound from '@/pages/Public/NotFound'
const AppRouter = () => {
  return (
    <Routes>
        {websiteroutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path='*' element={<NotFound/>} />
    </Routes>
  )
}

export default AppRouter