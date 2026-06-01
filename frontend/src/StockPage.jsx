import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import './StockPage.css'

function StockPage() {
  const { ticker } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [predicting, setPredicting] = useState(false)
  const [prediction, setPrediction] = useState(null)

  useEffect(() => {
    setLoading(true)
    setData(null)
    setPrediction(null)
    fetch(`/stocks/${ticker}`)
      .then(res => res.json())
      .then(json => {
        setData(json)
        setLoading(false)
      })
  }, [ticker])

  const handlePredict = () => {
    setPredicting(true)
    fetch(`/predict/${ticker}`)
      .then(res => res.json())
      .then(json => {
        setPrediction(json)
        setPredicting(false)
      })
  }

  // sample every 30 days for chart performance
  const chartData = data?.history
    ?.filter((_, i) => i % 30 === 0)
    .map(d => ({
      date: d.Date?.split('T')[0],
      price: parseFloat(d.Close?.toFixed(2)),
    })) || []

  if (loading) return (
    <div className="stock-loading">
      <p>Loading {ticker}...</p>
    </div>
  )

  const { info, news } = data

  return (
    <div className="stock-page">

      {/* HEADER */}
      <div className="stock-header">
        <div>
          <h1 className="stock-name">{info.name} <span className="stock-ticker">({ticker})</span></h1>
          <p className="stock-meta">{info.sector} — {info.industry} — {info.country}</p>
        </div>
        <div className="stock-price-block">
          <span className="stock-price">{info.price?.toLocaleString()} {info.currency}</span>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="stock-cards">
        <div className="card">
          <span className="card-label">Market Cap</span>
          <span className="card-value">${(info.market_cap / 1e9).toFixed(2)}B</span>
        </div>
        <div className="card">
          <span className="card-label">Volume</span>
          <span className="card-value">{info.volume?.toLocaleString()}</span>
        </div>
        <div className="card">
          <span className="card-label">Avg Volume</span>
          <span className="card-value">{info.avg_volume?.toLocaleString()}</span>
        </div>
        <div className="card">
          <span className="card-label">52W High</span>
          <span className="card-value">{info['52_week_high']}</span>
        </div>
        <div className="card">
          <span className="card-label">52W Low</span>
          <span className="card-value">{info['52_week_low']}</span>
        </div>
        <div className="card">
          <span className="card-label">PE Ratio</span>
          <span className="card-value">{info.pe_ratio?.toFixed(2) ?? 'N/A'}</span>
        </div>
        <div className="card">
          <span className="card-label">EPS</span>
          <span className="card-value">{info.eps?.toFixed(2) ?? 'N/A'}</span>
        </div>
        <div className="card">
          <span className="card-label">Beta</span>
          <span className="card-value">{info.beta?.toFixed(2) ?? 'N/A'}</span>
        </div>
        <div className="card">
          <span className="card-label">Dividend Yield</span>
          <span className="card-value">{info.dividend_yield ? (info.dividend_yield * 100).toFixed(2) + '%' : 'N/A'}</span>
        </div>
        <div className="card">
          <span className="card-label">Target Price</span>
          <span className="card-value">{info.target_price ?? 'N/A'}</span>
        </div>
        <div className="card">
          <span className="card-label">Recommendation</span>
          <span className="card-value card-rec">{info.recommendation?.toUpperCase() ?? 'N/A'}</span>
        </div>
        <div className="card">
          <span className="card-label">Employees</span>
          <span className="card-value">{info.employees?.toLocaleString() ?? 'N/A'}</span>
        </div>
      </div>

      {/* CHART */}
      <div className="stock-section">
        <h2 className="section-title">Price History</h2>
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis dataKey="date" tick={{ fill: '#6b6b6b', fontSize: 11 }} tickLine={false} />
              <YAxis tick={{ fill: '#6b6b6b', fontSize: 11 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ background: '#141414', border: '1px solid #222', borderRadius: 8 }}
                labelStyle={{ color: '#f5f5f5' }}
                itemStyle={{ color: '#f97316' }}
              />
              <Line type="monotone" dataKey="price" stroke="#f97316" dot={false} strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PREDICT BUTTON */}
      <div className="stock-section predict-section">
        <button className="btn-predict" onClick={handlePredict} disabled={predicting}>
          {predicting ? 'Running Prediction...' : '🤖 Predict Price Direction'}
        </button>

        {prediction && (
          <div className="prediction-result">
            <span className="pred-label">Prediction</span>
            <span className={`pred-value ${prediction.direction === 'UP' ? 'up' : 'down'}`}>
              {prediction.direction === 'UP' ? '▲ UP' : '▼ DOWN'}
            </span>
            <span className="pred-confidence">Confidence: {prediction.confidence}%</span>
          </div>
        )}
      </div>

      {/* NEWS */}
      <div className="stock-section">
        <h2 className="section-title">Latest News</h2>
        <div className="news-list">
          {news?.slice(0, 6).map((item, i) => (
            <a
              key={i}
              href={item.url || '#'}
              target="_blank"
              rel="noreferrer"
              className="news-item"
            >
              <span className="news-title">{item.headline}</span>
              <span className="news-date">{new Date(item.datetime * 1000).toISOString().split('T')[0]}</span>
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}

export default StockPage