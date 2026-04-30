from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import trafilatura
from typing import Optional
import uvicorn

app = FastAPI(title="CurrentAI Universal Scraper")

class ScrapingRequest(BaseModel):
    url: str

class ScrapingResponse(BaseModel):
    url: str
    title: Optional[str] = None
    content: Optional[str] = None
    author: Optional[str] = None
    date: Optional[str] = None
    status: str

@app.get("/")
def read_root():
    return {"message": "CurrentAI Scraper is online"}

@app.post("/extract", response_model=ScrapingResponse)
async def extract_content(request: ScrapingRequest):
    """
    Extracts clean text and metadata from a news article URL.
    Used by n8n to harvest content for LLM processing.
    """
    try:
        downloaded = trafilatura.fetch_url(request.url)
        if downloaded is None:
            raise HTTPException(status_code=400, detail="Failed to fetch URL")
            
        # Extract content with metadata (title, author, date)
        result = trafilatura.extract(
            downloaded, 
            include_comments=False, 
            include_tables=True,
            output_format="json"
        )
        
        if result is None:
            # Fallback to simple extraction if JSON metadata extraction fails
            content = trafilatura.extract(downloaded)
            return ScrapingResponse(
                url=request.url,
                content=content,
                status="success_simple"
            )
            
        import json
        data = json.loads(result)
        
        return ScrapingResponse(
            url=request.url,
            title=data.get("title"),
            content=data.get("text"),
            author=data.get("author"),
            date=data.get("date"),
            status="success"
        )
        
    except Exception as e:
        return ScrapingResponse(
            url=request.url,
            status="error",
            content=str(e)
        )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
