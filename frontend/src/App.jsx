import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import LandingPage from './landing_page.jsx'
import Dashboard from './Dashboard.jsx'
import './global.css'
 
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/*landing page*/}
        <Route path="/" element={<LandingPage />} />
 
        {/*navigation + search bar*/}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
 
export default App
 