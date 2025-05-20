# StockScreener
After constantly facing the issue of having to rely on multiple apps to get my information about the stock market and the stocks that I have invested in, I figured it would be best to have one platform to view all of it at once. Below is StockScreener which gives information, specifically, current news regarding the stocks that you are invested in, your current stock portfolio, and potential recommendations. 

## Features
- Get current information regarding the stocks you have invested in
- Look at your current portfolio
- Gain new insights into recommended stocks to buy (coming soon!)

## Current Interface
<img width="500" alt="Screenshot 2025-05-18 at 10 22 10 PM" src="https://github.com/user-attachments/assets/39e0e49a-4e9f-4501-b4fd-948c587be889" />
<img width="500" alt="Screenshot 2025-05-18 at 10 21 45 PM" src="https://github.com/user-attachments/assets/b5a4c6ef-866c-4e13-89f7-12e04c63279d" />

## Get Started
Interested in replicating this on your platform? Follow the steps below.

1. Set Up Virtual Environment

   ```bash
   python3 -m venv virtualenv
   source virtualenv/bin/activate
   ```
   
2. Install the Following Libraries

   ```bash
   requests, yfinance, python-dotenv, flask, flask-cors, pandas
   brew install node
   brew install python
   ```

3. Run Flask Backend & Replace IP Address

   ```bash
   source virtualenv/bin/activate
   python app.py
   ```

4. Run Expo Go Frontend

   ```bash
   source virtualenv/bin/activate
   cd stock-app
   npx expo start
   ```
