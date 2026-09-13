from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from engine import extract_pdf_text, run_legal_audit, LegalReport

app = FastAPI(title="LexiGuard API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SAMPLE_TEXT = """
FREELANCE SERVICES & IP ASSIGNMENT AGREEMENT
1. Non-Compete: The Contractor agrees not to provide consulting services to any competing company in the software industry globally for 24 months following contract completion.
2. Ownership of Work: All inventions, code, designs, and intellectual property created by Contractor during the term—whether created during working hours or on personal time—shall belong exclusively to the Client.
3. Payment Terms: Invoices will be paid within 90 days after delivery approval. Client reserves the right to withhold payment indefinitely for subjective dissatisfaction.
"""

@app.post("/api/audit", response_model=LegalReport)
async def audit_document(
    file: UploadFile = File(None),
    raw_text: str = Form(None),
    api_key: str = Form(...)
):
    text = ""
    if file:
        content = await file.read()
        text = extract_pdf_text(content)
    elif raw_text:
        text = raw_text
    else:
        raise HTTPException(status_code=400, detail="Please provide a PDF file or contract text.")
    
    try:
        report = run_legal_audit(text, api_key)
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/sample")
def get_sample():
    return {"sample_text": SAMPLE_TEXT}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
