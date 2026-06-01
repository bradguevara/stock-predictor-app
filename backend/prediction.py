from fastapi import APIRouter #this is for the endpoints
import yfinance as yf #this will give me the market information 
import pandas as pd #this is so i can manipulate the dataframes
from ta.momentum import RSIIndicator
#random forest skitlearn imports 
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from xgboost import XGBClassifier #another ML which seem to be better
from datetime import date
import finnhub
import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_KEY = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=GEMINI_KEY)
FINNHUB_KEY = os.getenv("FINNHUB_API_KEY")
finnhub_client = finnhub.Client(api_key=FINNHUB_KEY)


router = APIRouter() #this creates a router object

@router.get("/predict/{ticker}") #this tells fastAPI run this function when GET request with /predict/{Ticker}
def get_prediction(ticker):

    print("prediction.py loaded!")
    stock = yf.Ticker(ticker) #This gets me the stock
    stock_df = stock.history(period="max") #This gets me the dataframe for that stock

    #print(stock_df.head())
    #print(stock_df.columns)

    #Once we have the dataframe I will calculate more columns to train the ML model
    #I will create a 7 day running mean and a 30 days running mean to better see the price change and pattern.

    stock_df["mean7days"] = stock_df["Close"].rolling(7).mean() # average closing price over the last 7 days, smooths short term noise
    stock_df["mean30days"] = stock_df["Close"].rolling(30).mean() # average closing price over the last 30 days, captures long term trend
    stock_df["daily_range"] = stock_df["High"] - stock_df["Low"] # difference between high and low for that day, measures daily volatility
    stock_df['daily_return'] = stock_df['Close'].pct_change() # percentage price change from previous closing day
    stock_df['volume_change'] = stock_df['Volume'].pct_change() # percentage change in trading volume from previous day
    stock_df['price_vs_mean7'] = stock_df['Close'] / stock_df['mean7days'] # ratio of current price to 7 day average, above 1.0 means price is above short term trend
    stock_df['mean_volume7'] = stock_df['Volume'].rolling(7).mean() # average trading volume over last 7 days, helps identify unusual volume spikes
    stock_df['candle_body'] = stock_df['Close'] - stock_df['Open'] # positive means green candle (buyers won), negative means red candle (sellers won)
    stock_df['high_vs_close'] = stock_df['Close'] / stock_df['High'] # how close the stock closed to its daily high, close to 1.0 means strong buying pressure
    stock_df['momentum'] = stock_df['Close'] - stock_df['Close'].shift(5) # price difference between today and 5 days ago, positive means stock has been climbing
    stock_df['price_vs_mean30'] = stock_df['Close'] / stock_df['mean30days'] # ratio of current price to 30 day average, shows where price sits in the bigger picture
    stock_df['RSI'] = RSIIndicator(stock_df['Close']).rsi() # relative strength index 0-100, above 70 overbought, below 30 oversold, around 50 neutral
    stock_df['return_2days'] = stock_df['Close'].pct_change(2)
    stock_df['return_3days'] = stock_df['Close'].pct_change(3)
    stock_df['return_5days'] = stock_df['Close'].pct_change(5)

    stock_df['target'] = (stock_df['Close'].shift(-1) > stock_df['Close']).astype(int)

    # is short term trend above long term trend?
    stock_df['trend_signal'] = (stock_df['mean7days'] > stock_df['mean30days']).astype(int)

    # RSI zones
    stock_df['rsi_overbought'] = (stock_df['RSI'] > 70).astype(int)
    stock_df['rsi_oversold'] = (stock_df['RSI'] < 30).astype(int)

    stock_df['month'] = stock_df.index.month
    stock_df['is_quarter_end'] = stock_df['month'].isin([3, 6, 9, 12]).astype(int)

    stock_df = stock_df.dropna() #Cant predict on empty data (NaN)
    stock_df = stock_df.replace([float('inf'), float('-inf')], float('nan'))
    stock_df = stock_df.dropna()

    # define which columns the model will train on
    features = ['mean7days', 'mean30days', 'daily_return', 'volume_change', 
            'daily_range', 'price_vs_mean7', 'mean_volume7', 'candle_body', 
            'high_vs_close', 'momentum', 'price_vs_mean30', 'RSI',
            'return_2days', 'return_3days', 'return_5days', 'trend_signal', 'rsi_overbought', 'rsi_oversold', 'is_quarter_end']

    X = stock_df[features]  # the features to learn from 
    y = stock_df['target']  # the answer to predict

    # split data — 80% training, 20% testing
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, shuffle=False) #we will test on 80 percent of the data and will test on 20 percent of the total data



    # train the model

    model = XGBClassifier(n_estimators=200, random_state=42)
    model.fit(X_train, y_train)
    

    # check accuracy
    accuracy = model.score(X_test, y_test)

    print(f"Model accuracy: {accuracy * 100:.2f}%")

    # predict on the last row 
    last_row = X.iloc[[-1]]
    prediction = model.predict(last_row)[0]
    confidence = model.predict_proba(last_row)[0].max()

    direction = "UP" if prediction == 1 else "DOWN"

    print(f"Prediction: {direction}")
    print(f"Confidence: {confidence * 100:.2f}%")

    stock_news = finnhub_client.company_news(ticker, _from="2024-01-01", to=date.today().strftime("%Y-%m-%d"))



    return {
    "ticker": ticker,
    "ml_prediction": direction,
    "ml_confidence": round(float(confidence) * 100, 2),
    "ml_accuracy": round(float(accuracy) * 100, 2),
    }