import requests
import yfinance as yf
import os
from dotenv import load_dotenv

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
for name in stock_names:
    url = ('https://newsapi.org/v2/everything?'
        f'q={name}&'
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

    info = {
        'Company Name': name,
        'Article Title': json['articles'][0].get('title'),
        'Date Published': json['articles'][0].get('publishedAt'),
        'Article URL': json['articles'][0].get('url'),
        'Sentiment': sentiment_response.json()[0][0]['label']
    }

    stock_news.append(info)


## TODO:
## Find way to format the stock_news into a cleaner visual

print(stock_news)

#print(response.json())