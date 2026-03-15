from pydantic import BaseModel
from typing import List, Optional

class PredictionResponse(BaseModel):
    filename: str
    prediction: str
    confidence_info: str
    frames_checked: int
    
class ErrorResponse(BaseModel):
    error: str
