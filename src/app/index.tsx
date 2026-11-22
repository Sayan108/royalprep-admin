import { createRoot } from 'react-dom/client'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Provider } from 'react-redux'
import { RequireSession } from './guards/RequireSession'
import { adminRoutes } from './routes'
import { store } from './store'
import { Snackbar } from '../shared/ui/snackbar'
import '../shared/styles/style.css'
import '../shared/styles/screens.css'
import '../shared/styles/feedback.css'

createRoot(document.getElementById('root')!).render(<Provider store={store}><BrowserRouter><Routes>
  <Route path="/" element={<Navigate to="/admin" replace/>}/>
  {adminRoutes}
  <Route path="*" element={<RequireSession admin><main><h1>Page not found</h1><a href="/admin">Admin sign-in</a></main></RequireSession>}/>
</Routes><Snackbar/></BrowserRouter></Provider>)
