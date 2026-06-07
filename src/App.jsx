
import './App.css'
import '@/styles/global.css'
import '@/styles/theme.css'
import { BrowserRouter } from 'react-router-dom'
import { useOrg } from "./context/OrgContext";
import { applyOrgTheme } from "./utils/applyOrgTheme"; // 👈 import it
import { NotificationProvider } from "@/components/Notification/NotificationContainer";





import AppRouter from '@/Routes/AppRouter'
import { useEffect } from 'react'

function App() {
  const {org, loading, error} = useOrg();

  useEffect(() => {
  if (!org) return;
  applyOrgTheme(org); // 👈 one clean call handles everything
}, [org]);
  return (
    
    <BrowserRouter>
        <NotificationProvider>
          <AppRouter />
        </NotificationProvider>
    </BrowserRouter>
    
  )
}

export default App
