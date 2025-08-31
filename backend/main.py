from fastapi import FastAPI
from api.analyzer import router as analyzer_router
from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()


origins = [
        "http://localhost:3000",  
        "https://yourdomain.com", 
    ]


app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,  # Allow credentials (cookies, HTTP authentication)
        allow_methods=["*"],     # Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],     # Allow all headers
    )

@app.get("/")
async def server():
    return {"Status": "Server Running"}

# include analyzer routes
app.include_router(analyzer_router, prefix="/analyzer", tags=["Analyzer"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
