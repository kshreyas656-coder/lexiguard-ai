import fitz
from typing import List, Literal
from pydantic import BaseModel, Field
from google import genai
from google.genai import types

class ClauseDetail(BaseModel):
    clause_title: str = Field(description="Name or category of the clause")
    original_text: str = Field(description="Direct snippet from document")
    risk_level: Literal["Low", "Medium", "High", "Predatory"]
    plain_summary: str = Field(description="Plain English explanation")
    risk_reason: str = Field(description="Why this is risky or unfair")
    suggested_counter_clause: str = Field(description="Fair renegotiated clause version")

class LegalReport(BaseModel):
    document_type: str = Field(description="Type of agreement")
    overall_risk_score: int = Field(description="Risk rating from 0 to 100")
    executive_summary: str
    key_deadlines_and_obligations: List[str]
    clauses: List[ClauseDetail]
    lawyer_consultation_questions: List[str] = Field(description="Questions to ask a lawyer")

def extract_pdf_text(file_bytes: bytes) -> str:
    doc = fitz.open(stream=file_bytes, filetype="pdf")
    return "\n".join([page.get_text() for page in doc])

def run_legal_audit(text: str, api_key: str) -> LegalReport:
    client = genai.Client(api_key=api_key)
    system_prompt = (
        "You are an expert AI legal assistant. Analyze the provided contract or legal text. "
        "Highlight potential risks, hidden traps, unfair obligations, and suggest fair alternatives. "
        "Strictly adhere to the JSON schema. Note: The analysis is educational and informational only."
    )
    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=f"Analyze the following legal text thoroughly:\n\n{text}",
        config=types.GenerateContentConfig(
            system_instruction=system_prompt,
            response_mime_type="application/json",
            response_schema=LegalReport
        )
    )
    return LegalReport.model_validate_json(response.text)
