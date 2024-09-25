from bs4 import BeautifulSoup
import requests
import re
import pandas as pd
import os
from pymongo import MongoClient
from dotenv import load_dotenv

def crawlingNews():
    load_dotenv()
    mongodb_URI = os.getenv("MongoDBUrl")
    client = MongoClient(mongodb_URI)

    db = client["S11P23C203"]
    collection = db['news']
    collection.delete_many({})


    stock_num = ["005930", "086520", "000660", "035420", "373220", "352820", "035720", "005380", "001040", "105560", "000810", "010130", "000100", "068270", "006400", "051910", "000670", "247540", "096770", "196170"]

    for i in stock_num:
        page = 1
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
        result= {"날짜" : date_result, "언론사" : source_result, "기사제목" : title_result, "링크" : link_result}
        df = pd.DataFrame(result)
        df["주식번호"] = i


        data = df.to_dict('records')

        collection.insert_many(data)
    client.close()
    return "success"