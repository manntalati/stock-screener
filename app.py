from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import yfinance as yf
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from datetime import timedelta
import pandas as pd

current_time = datetime.now().date()
days_ago_3 = current_time - timedelta(days=7)

app = Flask(__name__)
CORS(app)

stock_symbols = [
        'AAPL',
        'AMD',
        'ARM',
        'AVD',
        'DELL',
        'NVDA',
        'PDSB',
        'PUBM',
        'QQQ',
        'TGT',
        'VRT',
        'VICI',
        'VOO'
        #'SP500',
    ]

load_dotenv()

@app.route('/analyze', methods=['GET'])
def analyze():
    stock_names = []

    for symbol in stock_symbols:
        dat = yf.Ticker(symbol)
        try:
            stock_names.append(dat.info['displayName'])
        except:
            try: 
                stock_names.append(dat.info['shortName'])
            except:
                print('No Name Exists')
            print('No Display Name')

    stock_news = []
    news_api = os.getenv('NEWS_API')
    for i in range(len(stock_names)):
        url = ('https://newsapi.org/v2/everything?'
            f'q={stock_names[i]}&'
            f'from={days_ago_3}&'
            f'to={current_time}&'
            'sortBy=publishedAt&'
            'pageSize=2&'
            f'apiKey={news_api}')

        response = requests.get(url)
        json = response.json()

        api_token = os.getenv('API_TOKEN')
        headers = {"Authorization": f"Bearer {api_token}"}

        sentiment_response = requests.post(
        "https://api-inference.huggingface.co/models/ProsusAI/finbert",
        headers=headers,
        json={"inputs": json['articles'][0].get('content')}
        )

        date = json['articles'][0].get('publishedAt')

        info = {
            'Stock Symbol': stock_symbols[i],
            'Company Name': stock_names[i],
            'Article Title': json['articles'][0].get('title'),
            'Date Published': datetime.fromisoformat(date.replace("Z", "+00:00")).astimezone(ZoneInfo("America/Chicago")),
            'Article URL': json['articles'][0].get('url'),
            'Sentiment': sentiment_response.json()[0][0]['label'].capitalize(),
            'Sentiment Score': sentiment_response.json()[0][0]['score']
        }

        stock_news.append(info)

    return jsonify(stock_news)

@app.route('/symbols', methods=['GET'])
def get_symbols():
    information = []

    for sym in stock_symbols:
        tickerInfo = yf.Ticker(sym).info
        try:
            price = tickerInfo['currentPrice']
            percent_change = tickerInfo['regularMarketChangePercent']
            price_change = tickerInfo['currentPrice'] - tickerInfo['regularMarketPreviousClose']
            information.append({
                'symbol': sym,
                'price': price,
                'price_change': price_change,
                'percent_change': percent_change
            })
        except KeyError:
            information.append({
                'symbol': sym,
                'price': 'Price Error',
                'price_change': 'Price Error',
                'percent_change': 'Percent Change Error'
            })

    return jsonify(information)


@app.route('/recommendations', methods=['GET'])
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
    top10 = attractive[:10]
    
    return jsonify(top10)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)