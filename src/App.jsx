import './App.css'
import { RouterProvider } from 'react-router-dom'
import { router } from './router/router-contributor-perfil'

function App() {
  return <RouterProvider router={router} />
}

export default App
