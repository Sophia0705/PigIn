from fastapi import FastAPI
from crawling import crawlingNews, getStockNews, crawlingGoldNews, getGoldNews, getCoinNews
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "https://j11c203.p.ssafy.io"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/news/health-check")
def root():
    return {"message": "news Pong!!"}

@app.get("/news/crawling")
def crawl_news():  # 함수 이름을 변경
    return crawlingNews()

@app.get("/news/gold-crawling")
def goldCrawling():
    return crawlingGoldNews()

@app.get("/news/getgold")
def getGold():
    return getGoldNews()

@app.get("/news/getcoin")
def getCoin():
    return getCoinNews()

@app.get("/news/{stockId}")
def stock_news(stockId):
    return getStockNews(stockId)
