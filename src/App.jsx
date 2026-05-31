
import './App.css'
import '@/styles/global.css'
import '@/styles/theme.css'
import { BrowserRouter } from 'react-router-dom'

import AppRouter from '@/Routes/AppRouter'

function App() {

  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default App
