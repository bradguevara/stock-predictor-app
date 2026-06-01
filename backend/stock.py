from fastapi import APIRouter
import yfinance as yf
import finnhub
import os
from dotenv import load_dotenv
from datetime import date

router = APIRouter()
load_dotenv()

FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_KEY)

@router.get("/stocks/{ticker}")
def get_stock(ticker):

    stock = yf.Ticker(ticker)
    stock_info = stock.info
    stock_history = stock.history(period="max")
    stock_news = finnhub_client.company_news(ticker, _from="2024-01-01", to=date.today().strftime("%Y-%m-%d"))



    return {
        "info": {
            "name": stock_info.get("longName"),
            "price": stock_info.get("currentPrice"),
            "country": stock_info.get("country"),
            "sector": stock_info.get("sector"),
            "industry": stock_info.get("industry"),
            "market_cap": stock_info.get("marketCap"),
            "52_week_high": stock_info.get("fiftyTwoWeekHigh"),
            "52_week_low": stock_info.get("fiftyTwoWeekLow"),
            "volume": stock_info.get("volume"),
            "currency": stock_info.get("currency"),
        },
        "history": stock_history.reset_index().to_dict(orient="records"),
        "news": stock_news,
    }