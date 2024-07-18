# -*- coding: utf-8 -*-
from flask import Flask
import schedule
import threading
import time
from pykrx import stock
from sqlalchemy import create_engine, Integer, BigInteger, Float
import pandas as pd
from datetime import datetime
from pyspark.sql import SparkSession
from pyspark.sql.functions import lit
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType, LongType
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

def get_database_url():
    return f"mysql+pymysql://{os.getenv('MYSQL_USER')}:{os.getenv('MYSQL_PASSWORD')}@{os.getenv('MYSQL_HOST')}:{os.getenv('MYSQL_PORT')}/{os.getenv('MYSQL_DATABASE')}"

def fetch_and_store_stock_data(market_type, start_date, end_date):
    engine = create_engine(get_database_url())
    new_column_names = {
        "시가": "market_price",
        "고가": "high_price",
        "저가": "low_price",
        "종가": "end_price",
        "거래량": "trading_volume",
        "등락률": "change_rate"
    }

    tickers = stock.get_market_ticker_list(market=market_type)
    for ticker in tickers:
        try:
            stock_name = stock.get_market_ticker_name(ticker)
            print(f"Processing {ticker} - {stock_name}")
            df = stock.get_market_ohlcv(start_date, end_date, ticker, adjusted=True)
            df['stock_code'] = ticker
            df.rename(columns=new_column_names, inplace=True)
            df.index.name = 'date'

            # 데이터 형식 변환
            df['market_price'] = df['market_price'].astype(int)
            df['high_price'] = df['high_price'].astype(int)
            df['low_price'] = df['low_price'].astype(int)
            df['end_price'] = df['end_price'].astype(int)
            df['trading_volume'] = df['trading_volume'].astype(int)
            df['change_rate'] = df['change_rate'].astype(float)

            table_name = 'stock_data'
            df.to_sql(table_name, con=engine, if_exists='append', index=True, dtype={
                'market_price': Integer,
                'high_price': Integer,
                'low_price': Integer,
                'end_price': Integer,
                'trading_volume': BigInteger,
                'change_rate': Float,
                'stock_code': StringType
            })
        except Exception as e:
            print(f"Error processing ticker {ticker}: {str(e)}")
            continue

    print(f"{market_type} stock data collection completed.")

def run_stock_data_collection():
    # KOSDAQ 개시 날짜와 KOSPI 개시 날짜
    kosdaq_start_date = "19960701"
    kospi_start_date = "19830103"
    end_date = datetime.now().strftime("%Y%m%d")  # 오늘 날짜

    # KOSDAQ 데이터 수집 및 저장
    fetch_and_store_stock_data("KOSDAQ", kosdaq_start_date, end_date)

    # KOSPI 데이터 수집 및 저장
    fetch_and_store_stock_data("KOSPI", kospi_start_date, end_date)

@app.route('/')
def home():
    return "Stock data collection job is running."

def run_schedule():
    while True:
        schedule.run_pending()
        time.sleep(1)

if __name__ == '__main__':
    # 스케줄 작업 설정: 하루에 한 번 실행
    schedule.every().day.at("00:00").do(run_stock_data_collection)

    # 스케줄러 스레드 시작
    scheduler_thread = threading.Thread(target=run_schedule)
    scheduler_thread.start()

    # Flask 앱 실행
    app.run(host='0.0.0.0', port=5000)
