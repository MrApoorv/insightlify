from fastapi import FastAPI
from api.analyzer import router as analyzer_router
from fastapi.middleware.cors import CORSMiddleware
import os
app = FastAPI()
from dotenv import load_dotenv

load_dotenv()
PORT = int(os.getenv('PORT'))
ENV = os.getenv('ENV')

origins = [
        "http://localhost:3000",  
        "https://insightlify-eta.vercel.app", 
    ]


app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,  
        allow_methods=["*"],     
        allow_headers=["*"],     
    )

@app.get("/")
async def server():
    return {"Status": "Server Running"}

app.include_router(analyzer_router, prefix="/analyzer", tags=["Analyzer"])