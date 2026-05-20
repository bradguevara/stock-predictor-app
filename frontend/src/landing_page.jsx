import './global.css';

function App() {
  return (
    <>
      {/* NAV */}
      <nav className="nav">
        <div className="logo">Stock<span>Predictor</span></div>
        <ul className="nav-links">
          <li><a href="#">Docs</a></li>
          <li><a href="#">API</a></li>
          <li><a href="#">GitHub</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="hero">

        <div className="badge">
          <span className="badge-dot" />
          Powered by Yahoo Finance + scikit-learn
        </div>

        <h1>
          Predict whether a stock goes <em>up</em> or <em>down</em>
        </h1>

        <p className="subtitle">
          A full-stack app that pulls real market data, stores it in a
          database, and runs a machine learning model to forecast
          next-day price direction.
        </p>

        <div className="cta-row">
          <a href="/dashboard" className="btn-primary">Get Started →</a>  {/*HERE IS THE GET STARTED TO DASHBOARD*/}
          <a href="#" className="btn-secondary">View on GitHub</a>
        </div>

        {/* STATS */}
        <div className="stats">
          <div className="stat">
            <div className="stat-value">8</div>
            <div className="stat-label">API Endpoints</div>
          </div>
          <div className="stat">
            <div className="stat-value">ML</div>
            <div className="stat-label">Predictions</div>
          </div>
          <div className="stat">
            <div className="stat-value">Live</div>
            <div className="stat-label">Yahoo Finance</div>
          </div>
        </div>

        {/* FEATURES */}
        <div className="features">
          <div className="feature">
            <div className="feature-icon">📈</div>
            <div className="feature-title">Live Stock Data</div>
            <div className="feature-desc">
              Pulls real-time prices and history directly from Yahoo Finance.
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">🤖</div>
            <div className="feature-title">ML Predictions</div>
            <div className="feature-desc">
              Random Forest model trained on technical indicators to predict price direction.
            </div>
          </div>
          <div className="feature">
            <div className="feature-icon">🗄️</div>
            <div className="feature-title">Database Storage</div>
            <div className="feature-desc">
              All stock data and predictions persisted with SQLAlchemy + SQLite.
            </div>
          </div>
        </div>

      </section>
    </>
  );
}

export default App;