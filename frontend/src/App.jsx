import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Layout.jsx'
import LandingPage from './landing_page.jsx'
import Dashboard from './Dashboard.jsx'
import StockPage from './StockPage.jsx'
import './global.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* landing page */}
        <Route path="/" element={<LandingPage />} />

        {/* pages with nav + search bar */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/stocks/:ticker" element={<StockPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App