from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import yfinance as yf
import os
from dotenv import load_dotenv
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

app = Flask(__name__)
CORS(app)

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
            'from=2025-05-12&'
            'to=2025-05-16&'
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
            information.append({
                'symbol': sym,
                'price': price,
                'percent_change': percent_change
            })
        except KeyError:
            information.append({
                'symbol': sym,
                'price': 'Price Error',
                'percent_change': 'Percent Change Error'
            })

    return jsonify(information)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8081, debug=True)