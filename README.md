# Stock Screener
- Get current information regarding the stocks you have invested in
- Look at your current portfolio
- Gain new insights into recommended stocks to buy


## Get Started

1. Set Up Virtual Environment

   ```bash
   python3 -m venv virtualenv
   source virtualenv/bin/activate
   ```
   
2. Install the Following Libraries

   ```bash
   requests, yfinance, python-dotenv, flask, flask-cors
   ```

3. Run Flask Backend & Replace IP Address

   ```bash
   flask run --host=0.0.0.0 --port=8081
   ```

4. Run Expo Go Frontend

   ```bash
   cd stock-app
   ```

   ```bash
   npx expo start
   ```
