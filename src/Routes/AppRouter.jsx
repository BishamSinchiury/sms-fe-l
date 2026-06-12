import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { websiteroutes } from './PublicRoutes'
import { userRoutes } from './PrivateRoutes'
import { adminRoutes } from './AdminRoutes'
import { OrgProvider } from '@/context/OrgContext'
import NotFound from '@/pages/Public/NotFound'
import ServerDown from '@/pages/Public/ServerDown'

const AppRouter = () => {
  return (
    <Routes>
      {/* Outside OrgProvider — no org API call made */}
      <Route path="/server-down" element={<ServerDown />} />

      {/* Everything else gets OrgProvider */}
      <Route element={<OrgProvider />}>
        {websiteroutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        {userRoutes}
        {adminRoutes}
        <Route path="*" element={<NotFound />} />
      </Route>

    </Routes>
  )
}

export default AppRouter