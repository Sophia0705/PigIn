from fastapi import FastAPI
from crawling import crawlingNews,getStockNews  # crawling 모듈에서 crawlingNews 함수를 직접 import

app = FastAPI()

@app.get("/api/news")
async def root():
    return {"message": "Hello World"}

@app.get("/api/news/crawling")
async def crawl_news():  # 함수 이름을 변경
    return crawlingNews()

@app.get("/api/news/{stockId}")
async def stock_news(stockId):
    return getStockNews(stockId)