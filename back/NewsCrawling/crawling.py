from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import os
from pymongo import MongoClient
from dotenv import load_dotenv
import datetime

def crawlingNews():
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)

    db = client["S11P23C203"]
    collection = db['news']
    collection.delete_many({})


    stock_num = ["005930", "086520", "000660", "035420", "373220", "352820", "035720", "005380", "001040", "105560", "000810", "010130", "000100", "068270", "006400", "051910", "000670", "247540", "096770", "196170"]

    for i in stock_num:
        for page in range(1,11):
            company_code = i
            url = f'https://finance.naver.com/item/news_news.nhn?code={str(company_code)}&page={str(page)}'

            source_code = requests.get(url).text
            html = BeautifulSoup(source_code, "html.parser")

            titles = html.select(".title")
            title_result=[]
            for title in titles:
                title = title.get_text()
                title = re.sub('\n','', title)
                title_result.append(title)

            links = html.select(".title")
            link_result=[]
            for link in links:
                add = 'https://finance.naver.com' + link.find('a')['href']
                link_result.append(add)
            # 뉴스 날짜가지고 오기
            dates = html.select('.date') 
            date_result = [date.get_text() for date in dates] 

            # 뉴스 매체 가지고 오기
            sources = html.select('.info')
            source_result = [source.get_text() for source in sources] 
            result= {"Date" : date_result, "NewsCompany" : source_result, "NewsTitle" : title_result, "Link" : link_result}
            df = pd.DataFrame(result)
            df["StockId"] = i


            data = df.to_dict('records')

            collection.insert_many(data)
    client.close()
    return "success"

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

# def crawl_gold():
# headers = {'User-Agent' : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.86 Safari/537.36'}
# data = requests.get('https://kr.investing.com/commodities/gold-news/1',headers=headers)

# soup = BeautifulSoup(data.text, 'html.parser')

# soup.select('#__next > div.md\:relative.md\:bg-white > div.relative.flex > div.grid.flex-1.grid-cols-1.px-4.pt-5.font-sans-v2.text-\[\#232526\].antialiased.xl\:container.sm\:px-6.md\:grid-cols-\[1fr_72px\].md\:gap-6.md\:px-7.md\:pt-10.md2\:grid-cols-\[1fr_420px\].md2\:gap-8.md2\:px-8.xl\:mx-auto.xl\:gap-10.xl\:px-10 > div.min-w-0 > div:nth-child(3) > ul')
def scrape_gold_news():
    url = 'https://kr.investing.com/commodities/gold-news/1'
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
                'date': date_str[0:4] + '.' + date_str[6] + '.' + date_str[9:11]
            })
        except Exception as e:
            print(f"Error parsing article: {e}")

    return parsed_articles

# 사용 예:
articles = scrape_gold_news()
for article in articles:
    print(article)