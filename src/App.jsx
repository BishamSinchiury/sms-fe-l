import './App.css'
import '@/styles/global.css'
import '@/styles/theme.css'
import { NotificationProvider } from "@/components/Notification/NotificationContainer"
import AppRouter from '@/Routes/AppRouter'

function App() {
  return (
    <NotificationProvider>
      <AppRouter />
    </NotificationProvider>
  )
}

export default App