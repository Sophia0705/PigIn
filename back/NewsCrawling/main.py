from fastapi import FastAPI
from crawling import crawlingNews,getStockNews  # crawling 모듈에서 crawlingNews 함수를 직접 import
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173/**",
    "https://j11c203.p.ssafy.io/**"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/news/health-check")
async def root():
    return {"message": "news Pong"}

@app.get("/news/crawling")
async def crawl_news():  # 함수 이름을 변경
    return crawlingNews()

@app.get("/news/{stockId}")
async def stock_news(stockId):
    return getStockNews(stockId)