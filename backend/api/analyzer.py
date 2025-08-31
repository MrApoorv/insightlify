from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from typing import Optional
from services.analyzer_service import analyze_text, process_file

router = APIRouter()

@router.post("/upload")
async def upload_input(
    file: Optional[UploadFile] = File(None),
    text: Optional[str] = Form(None)
):
    try:
        if file:
            result = await process_file(file)
        elif text:
            result = await analyze_text(text)
        else:
            raise HTTPException(status_code=400, detail="No file or text provided")

        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
