from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from pymongo import MongoClient
import time
from dotenv import load_dotenv
import os
from bs4 import BeautifulSoup

load_dotenv()
mongodb_URI = os.getenv("MongoDBUrl")
client = MongoClient(mongodb_URI)
db = client["S11P23C203"]
collection = db['news']

stock_num = ["005930", "086520", "000660", "035420", "373220", "352820", "035720", "005380", "001040", "105560", "000810", "010130", "000100", "068270", "006400", "051910", "000670", "247540", "096770", "196170"]

# Path to your ChromeDriver (make sure it's installed and in the right path)
chrome_driver_path = "../../../chromedriver-win64/chromedriver.exe"

# Initialize the Chrome driver
driver = webdriver.Chrome(service=Service(chrome_driver_path))

articles = []

for stockId in stock_num:
    # Open the website
    driver.get(f'https://finance.daum.net/quotes/A{stockId}#news/stock')

    # Wait for the page to fully load (adjust time based on your network speed)
    time.sleep(5)

    # Extract page source
    page_source = driver.page_source

    # Now parse it with BeautifulSoup
    soup = BeautifulSoup(page_source, 'lxml')

    # Find the section containing news articles
    news_section = soup.find('div', class_='box_contents')

    # Check if we found the news section
    if news_section is None:
        print("Could not find news section")
    else:
        for news in news_section.find_all('li'):
            title = news.find('a', class_='tit').text.strip()
            href = news.find('a', class_='tit')['href']
            date_provider = news.find('p', class_='date').text
            provider, date = date_provider.split(' · ')

            article_data = {
                'StockId' : stockId,
                'Date': date,
                'NewsCompany': provider,
                'NewsTitle': title,
                'Link': href
            }
            articles.append(article_data)

# Close the browser
driver.quit()

collection.insert_many(articles)
client.close()