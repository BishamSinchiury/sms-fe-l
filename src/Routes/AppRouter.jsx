import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { websiteroutes } from './PublicRoutes'
const AppRouter = () => {
  return (
    <Routes>
        {websiteroutes.map(({ path, element }) => (
          <Route path={path} element={element} />
        ))}
    </Routes>
  )
}

export default AppRouter