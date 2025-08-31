from utils.file_utils import extract_text_from_pdf, extract_text_from_image
from models.model_utils import analyze_text_with_gemini

async def process_file(file):
    file_bytes = await file.read()

    if file.filename.endswith(".pdf"):
        extracted_text = await extract_text_from_pdf(file_bytes)
    else:
        extracted_text = await extract_text_from_image(file_bytes)

    if not extracted_text:
        return {"error": "No text found in file"}

    analysis = await analyze_text_with_gemini(extracted_text)

    return {
        "filename": file.filename,
        "extracted_text": extracted_text,
        "analysis": analysis
    }

async def analyze_text(text):
    analysis = await analyze_text_with_gemini(text)
    return {
        "extracted_text": text,
        "analysis": analysis
    }

