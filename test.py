import requests
import yfinance as yf
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
import pandas as pd

load_dotenv()

stock_symbols = [
    'AAPL',
    'AMD',
    'ARM',
    'AVD',
    'DELL',
    'ELF',
    'NVDA',
    'PDSB',
    'PUBM',
    'QQQ',
    'TGT',
    'VRT'
]

## TODO:
# Add user interface so that user can input stock symbols

def get_recommendations():
    url = "https://en.wikipedia.org/wiki/List_of_S%26P_500_companies"
    df  = pd.read_html(url)[0]
    tickers = df["Symbol"].tolist()

    mins = {'beta': float('inf'), 'revenuePerShare': float('inf'), 'grossMargins': float('inf'), 'debtToEquity': float('inf'), 'returnOnEquity': float('inf')}
    maxs = {'beta': float('-inf'), 'revenuePerShare': float('-inf'), 'grossMargins': float('-inf'), 'debtToEquity': float('-inf'), 'returnOnEquity': float('-inf')}
    fundamentals = []
    for ticker in tickers:
        tickerInfo = yf.Ticker(ticker).info
        for metric in ['beta', 'revenuePerShare', 'grossMargins', 'debtToEquity', 'returnOnEquity']:
            value = tickerInfo.get(metric)
            mins[metric] = min(mins[metric], value) if value is not None else mins[metric]
            maxs[metric] = max(maxs[metric], value) if value is not None else maxs[metric]
        try:
            fundamentals.append({
                'industry': tickerInfo['industry'],
                'beta': tickerInfo['beta'],
                'revenue': tickerInfo['revenuePerShare'],
                'other_recommendation': tickerInfo['recommendationKey'],
                'gross_margin': tickerInfo['grossMargins'],
                'debt_to_equity': tickerInfo['debtToEquity'],
                'roe': tickerInfo['returnOnEquity'],
                'symbol': ticker,
                'price': tickerInfo['currentPrice'],
            })
        except KeyError:
            fundamentals.append({
                'industry': 'N/A',
                'beta': 0,
                'revenue': 0,
                'other_recommendation': 0,
                'gross_margin': 0,
                'debt_to_equity': 0,
                'roe': 0,
                'symbol': ticker,
                'price': 0,
            })

    attractive = []
    for ticker in fundamentals:
        other_rec_score = {'strongBuy': 1, 'buy': 0.75, 'hold': 0.5, 'sell': 0.25, 'strongSell': 0}
        betaScore = 1 - (abs(ticker['beta'] - 1) / max(1 - mins['beta'], maxs['beta'] - 1))
        revenueScore = (ticker['revenue'] - mins['revenuePerShare']) / (maxs['revenuePerShare'] - mins['revenuePerShare'])
        grossScore = (ticker['gross_margin'] - mins['grossMargins']) / (maxs['grossMargins'] - mins['grossMargins'])
        debtScore = 1 - (ticker['debt_to_equity'] - 1) / max(1 - mins['debtToEquity'], maxs['debtToEquity'] - 1)
        roeScore = (ticker['roe'] - mins['returnOnEquity']) / (maxs['returnOnEquity'] - mins['returnOnEquity'])
        otherRecScore = other_rec_score.get(ticker['other_recommendation'], 0)
        buyScore = 0.2 * otherRecScore + 0.53 * (revenueScore + grossScore + roeScore) + 0.27 * (debtScore + betaScore)
        attractive.append({
            'industry': ticker['industry'],
            'symbol': ticker['symbol'],
            'price': ticker['price'],
            'buyScore': buyScore
        })
    attractive.sort(key=lambda x: x['buyScore'], reverse=True)
    top5 = attractive[:5]
    
    print(top5)

get_recommendations()