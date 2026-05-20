import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import './Layout.css'

function Layout() {
  const [ticker, setTicker] = useState('')

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', ticker)
  }

  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="logo">Stock<span>Predictor</span></div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="/dashboard">Dashboard</a></li>
          <li><a href="#">GitHub</a></li>
        </ul>
      </nav>

      {/* SEARCH BAR */}
      <div className="search-bar-wrapper">
        <form className="search-form" onSubmit={handleSearch}>
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search a ticker — AAPL, TSLA, NVDA..."
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>
      </div>

      {/* PAGE CONTENT GOES HERE */}
      <div className="page-content">
        <Outlet />
      </div>
    </>
  )
}

export default Layout