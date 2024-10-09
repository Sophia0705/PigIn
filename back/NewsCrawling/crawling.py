from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import datetime

def getStockNews(stockId):
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)
    db = client["S11P23C203"]
    collection = db['news']

    results = collection.find({"StockId" : stockId})

    response = []

    print(results)
    for document in results:
        response.append({"Date" : document["Date"], "NewsCompany" : document["NewsCompany"], "NewsTitle" : document["NewsTitle"], "Link" : document["Link"]})
    client.close()
    return response

def crawlingGoldNews():
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)

    db = client["S11P23C203"]
    collection = db['GoldNews']
    collection.delete_many({})

    for i in range(1, 3):
        print(i)
        url = 'https://kr.investing.com/commodities/gold-news/' + str(i)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
        }

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch the page. Status code: {response.status_code}")
            return []
        soup = BeautifulSoup(response.text, 'html.parser')
        articles = soup.select('#__next > div.md\:relative.md\:bg-white > div.relative.flex > div.grid.flex-1.grid-cols-1.px-4.pt-5.font-sans-v2.text-\[\#232526\].antialiased.xl\:container.sm\:px-6.md\:grid-cols-\[1fr_72px\].md\:gap-6.md\:px-7.md\:pt-10.md2\:grid-cols-\[1fr_420px\].md2\:gap-8.md2\:px-8.xl\:mx-auto.xl\:gap-10.xl\:px-10 > div.min-w-0 > div:nth-child(3) > ul > li')
        parsed_articles = []
        for article in articles:
            try:
                title_elem = article.select_one('a[data-test="article-title-link"]')
                title = title_elem.text.strip()
                url = title_elem['href']       
                description_elem = article.select_one('p[data-test="article-description"]')
                description = description_elem.text.strip() if description_elem else None        
                provider_elem = article.select_one('span[data-test="news-provider-name"]')
                provider = provider_elem.text.strip() if provider_elem else None          
                date_elem = article.select_one('time[data-test="article-publish-date"]')
                if date_elem:
                    date_str = date_elem.text.strip()
                    date = datetime.datetime.strptime(date_str, '%Y년 %m월 %d일').date()
                else:
                    date = None
                parsed_articles.append({
                    'NewsTitle': title,
                    'Link': url,
                    'provider': provider,
                    'date': date_str
                })
            except Exception as e:
                print(f"Error parsing article: {e}")
        collection.insert_many(parsed_articles)
    client.close()
    return "success"

def getGoldNews():
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)
    db = client["S11P23C203"]
    collection = db['GoldNews']

    results = collection.find()

    response = []
    for document in results:
        response.append({"Date" : document["date"], "NewsCompany" : document["provider"], "NewsTitle" : document["NewsTitle"], "Link" : document["Link"]})

    return response

def crawlingCoinNews():
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)

    db = client["S11P23C203"]
    collection = db['CoinNews']
    collection.delete_many({})

    parsed_articles = []

    for i in range(1, 3):
        print(i)
        url = 'https://kr.investing.com/news/cryptocurrency-news/' + str(i)
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'
        }

        response = requests.get(url, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch the page. Status code: {response.status_code}")
            continue  # 페이지 가져오기 실패 시 다음 페이지로 넘어갑니다.
        
        soup = BeautifulSoup(response.text, 'html.parser')
        articles_container = soup.select_one('#__next > div.md\:relative.md\:bg-white > div.relative.flex > div.grid.flex-1.grid-cols-1.px-4.pt-5.font-sans-v2.text-\[\#232526\].antialiased.xl\:container.sm\:px-6.md\:grid-cols-\[1fr_72px\].md\:gap-6.md\:px-7.md\:pt-10.md2\:grid-cols-\[1fr_420px\].md2\:gap-8.md2\:px-8.xl\:mx-auto.xl\:gap-10.xl\:px-10 > div.min-w-0 > div > div.news-analysis-v2_articles-container__3fFL8.mdMax\:px-3.mb-12 > ul')

        if not articles_container:
            print(f"No articles container found on page {i}")
            continue

        articles = articles_container.find_all('li', class_='list_list__item__dwS6E')

        for article in articles:
            title_link = article.find('a', class_='text-inv-blue-500')
            if not title_link:
                continue
            
            title = title_link.text.strip()
            href = title_link.get('href', '')
            
            date_element = article.find('time')
            date = date_element['datetime'] if date_element else "날짜 없음"
            
            provider_element = article.find('span', attrs={'data-test': 'news-provider-name'})
            provider = provider_element.text.strip() if provider_element else "제공사 없음"

            article_data = {
                'Date': date,
                'NewsCompany': provider,
                'NewsTitle': title,
                'Link': href
            }

            try:
                # 'Link'를 유니크 식별자로 사용하여 업데이트 또는 삽입
                result = collection.update_one(
                    {'Link': href},
                    {'$set': article_data},
                    upsert=True
                )
                if result.upserted_id:
                    print(f"Inserted new article: {title}")
                elif result.modified_count:
                    print(f"Updated existing article: {title}")
                else:
                    print(f"No changes for article: {title}")
            except Exception as e:
                print(f"Error processing article {title}: {e}")

    client.close()
    return "success"

def getCoinNews():
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)
    db = client["S11P23C203"]
    collection = db['CoinNews']

    results = collection.find()

    response = []
    for document in results:
        response.append({"Date" : document["Date"], "NewsCompany" : document["NewsCompany"], "NewsTitle" : document["NewsTitle"], "Link" : document["Link"]})

    return response

